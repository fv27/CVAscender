import Foundation
import SwiftUI

/// The student’s profile, "My path" and own activities — saved on this device only, in an encrypted file.
@MainActor
final class StudentStore: ObservableObject {
    @Published var profile: Profile? { didSet { persist() } }
    @Published var tracks: [String: Track] = [:] { didSet { persist() } }
    @Published var custom: [CustomActivity] = [] { didSet { persist() } }

    private let legacyKey = "cva.state.v1"
    private struct Saved: Codable {
        var profile: Profile?
        var tracks: [String: Track]
        var custom: [CustomActivity]?
    }

    /// Saved in Application Support with iOS Data Protection: the file is encrypted with a key
    /// tied to the device passcode and can't be read while the phone hasn't been unlocked since
    /// restart. Encrypted iPhone backups still include it, so nothing is lost when changing phone.
    private static var fileURL: URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("cvascender-state.json")
    }

    init() {
        var data = try? Data(contentsOf: Self.fileURL)
        if data == nil, let legacy = UserDefaults.standard.data(forKey: legacyKey) {
            data = legacy                                      // move data saved by older versions
            UserDefaults.standard.removeObject(forKey: legacyKey)
        }
        if let data, data.count < 5_000_000, let saved = try? JSONDecoder().decode(Saved.self, from: data) {
            profile = saved.profile.map(Self.clean)
            // Drop tracks for listings that no longer exist; cap sizes so a damaged file can't bloat the app.
            tracks = saved.tracks.filter { Catalog.shared.byId[$0.key] != nil }
            custom = Array((saved.custom ?? []).prefix(200))
        }
    }

    /// Keeps saved values within sensible limits.
    private static func clean(_ p: Profile) -> Profile {
        var p = p
        p.name = String(p.name.prefix(40))
        p.city = String(p.city.prefix(60))
        p.age = min(max(p.age, 10), 25)
        return p
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(Saved(profile: profile, tracks: tracks, custom: custom)) else { return }
        try? data.write(to: Self.fileURL, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
    }

    func status(of id: String) -> TrackStatus? { tracks[id]?.status }
    func isSaved(_ id: String) -> Bool { tracks[id] != nil }

    func set(_ id: String, to status: TrackStatus?, cvLine: String? = nil) {
        if let status {
            tracks[id] = Track(status: status, updated: Date(), cvLine: cvLine ?? tracks[id]?.cvLine)
        } else {
            tracks[id] = nil
            Reminders.cancel(id: id)
        }
    }

    /// Bookmark on/off. Un-saving only removes things that are just "saved".
    func toggleSaved(_ id: String) {
        if tracks[id] == nil { set(id, to: .saved) } else if tracks[id]?.status == .saved { set(id, to: nil) }
    }

    func items(_ status: TrackStatus) -> [PathItem] {
        var out: [PathItem] = []
        for (id, t) in tracks where t.status == status {
            if let o = Catalog.shared.byId[id] { out.append(PathItem(o: o, t: t)) }
        }
        return out.sorted { $0.t.updated > $1.t.updated }
    }

    func count(_ status: TrackStatus) -> Int { tracks.values.filter { $0.status == status }.count }

    /// CV gap analysis for every dimension (same rules as the website's analyseCV).
    var analysis: CVAnalysis {
        Matcher.analyse(profile: profile ?? Profile(), tracks: tracks, custom: custom)
    }
    /// The app has no CV gap analysis (the owner removed it), so gaps never affect the feed.
    var gaps: [String] { [] }

    /// Skills gained from completed listings and own activities.
    var skillsGained: [String: Int] {
        var out: [String: Int] = [:]
        for (id, t) in tracks where t.status == .completed {
            for s in Catalog.shared.byId[id]?.skills ?? [] { out[s, default: 0] += 1 }
        }
        for c in custom { for s in c.skills { out[s, default: 0] += 1 } }
        return out
    }

    func resetAll() {
        Reminders.cancelAll()
        try? FileManager.default.removeItem(at: Self.fileURL)
        tracks = [:]
        custom = []
        profile = nil
    }
}

/// One row on My path.
struct PathItem: Identifiable {
    let o: Opportunity
    let t: Track
    var id: String { o.id }
}

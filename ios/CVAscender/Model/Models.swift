import Foundation

/// One listing, exported from the website's lib/ files by `npm run ios:data`.
struct Opportunity: Codable, Identifiable, Hashable {
    let id: String
    /// "CH", "GB", or nil for worldwide (online / abroad) listings.
    let country: String?
    let title: String
    let org: String
    let type: String
    let group: String
    let categories: [String]
    let skills: [String]
    let scope: String
    let format: String
    let city: String?
    let canton: String?
    let aliases: [String]?
    let cantons: [String]?
    let minAge: Int?
    let maxAge: Int?
    let minYear: Int?
    let maxYear: Int?
    let eligibility: String?
    let description: String
    let details: String?
    let timing: String?
    let commitment: String?
    let cost: String?
    let link: String?
    let linkIsSearch: Bool?
    let deadline: String?
    let verified: Bool
    let source: String?
    let sport: String?
    let finder: String?
    let cvSection: String?
    let dim: String?
    let photo: String?
    let photoIsReal: Bool?
    let logo: String?
    let logoHost: String?

    var isClub: Bool { type == "Sports club" && finder == nil }

    var photoURL: URL? { photo.flatMap(URL.init(string:)).flatMap { $0.scheme == "https" ? $0 : nil } }
    /// The organiser website's icon (same icon service as the website).
    var logoURL: URL? {
        if let logo, let u = URL(string: logo), u.scheme == "https" { return u }   // the club's own logo (https only)
        guard let host = logoHost else { return nil }
        return URL(string: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://\(host)&size=128")
    }
    var scopeLabel: String {
        switch scope {
        case "local": return "Local"
        case "national": return "National"
        case "global": return "Abroad / online"
        default: return scope.capitalized
        }
    }

    /// Official link — only https/http web pages are ever opened (no other URL schemes).
    var linkURL: URL? { Opportunity.safeWebURL(link) }
    static func safeWebURL(_ s: String?) -> URL? {
        guard let s, let u = URL(string: s), let scheme = u.scheme?.lowercased(), scheme == "https" || scheme == "http", u.host != nil else { return nil }
        return u
    }

    /// Official deadline (end of that day), if one was published.
    var deadlineDate: Date? {
        guard let deadline else { return nil }
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        guard let day = f.date(from: deadline) else { return nil }
        return Calendar.current.date(bySettingHour: 23, minute: 59, second: 0, of: day)
    }

    var daysLeft: Int? {
        guard let d = deadlineDate else { return nil }
        let start = Calendar.current.startOfDay(for: Date())
        return Calendar.current.dateComponents([.day], from: start, to: d).day
    }

    var deadlineLabel: String {
        guard let days = daysLeft, let date = deadlineDate else { return timing ?? "See official site" }
        if days < 0 { return "Deadline passed" }
        if days == 0 { return "Closes today" }
        if days == 1 { return "Closes tomorrow" }
        if days <= 14 { return "\(days) days left" }
        return "Deadline " + date.formatted(date: .abbreviated, time: .omitted)
    }

    var locationLabel: String {
        if format == "online" { return scope == "global" || country == nil ? "Online · worldwide" : (country == "GB" ? "Online · UK" : "Online · Switzerland") }
        let wide = country == "GB" ? "Across the UK" : country == "CH" ? "Across Switzerland" : "Worldwide"
        let place = city ?? (canton.map { Catalog.shared.cantonName($0) } ?? wide)
        return format == "hybrid" ? "\(place) · hybrid" : place
    }
}

struct Interest: Codable, Hashable { let id: String; let label: String; let hue: String }
struct Canton: Codable, Hashable { let code: String; let name: String; let country: String }
struct CountryInfo: Codable, Hashable { let code: String; let name: String; let regionLabel: String; let regionPlural: String; let example: String }
struct SchoolYear: Codable, Hashable { let value: Int; let label: String }
struct Dimension: Codable, Hashable { let id: String; let label: String; let blurb: String }

struct CatalogFile: Codable {
    let generated: String
    let countries: [CountryInfo]
    let interests: [Interest]
    let skills: [String]
    let cantons: [Canton]
    let schoolYears: [SchoolYear]
    let ukSchoolYears: [SchoolYear]
    let dimensions: [Dimension]
    let towns: [String: [String]]
    let opportunities: [Opportunity]
}

/// The student's answers from onboarding.
struct Profile: Codable, Equatable {
    var name: String = ""
    var country: String = "CH"          // "CH" or "GB"
    var canton: String = ""
    var city: String = ""
    var age: Int = 15
    var year: Int = 10
    var interests: [String] = []
    var skills: [String] = []
}

extension Profile {
    // Profiles saved before the UK was added have no "country": treat them as Swiss.
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? ""
        country = try c.decodeIfPresent(String.self, forKey: .country) ?? "CH"
        canton = try c.decode(String.self, forKey: .canton)
        city = try c.decode(String.self, forKey: .city)
        age = try c.decode(Int.self, forKey: .age)
        year = try c.decode(Int.self, forKey: .year)
        interests = try c.decode([String].self, forKey: .interests)
        skills = try c.decode([String].self, forKey: .skills)
    }
}

enum TrackStatus: String, Codable, CaseIterable, Identifiable {
    case saved, applied, completed
    var id: String { rawValue }
    var label: String {
        switch self {
        case .saved: return "Saved"
        case .applied: return "Applied"
        case .completed: return "Completed"
        }
    }
    var symbol: String {
        switch self {
        case .saved: return "bookmark.fill"
        case .applied: return "paperplane.fill"
        case .completed: return "checkmark.seal.fill"
        }
    }
}

/// Something the student did outside CVAscender (a club, a job…). It counts for the CV too.
struct CustomActivity: Codable, Identifiable, Equatable {
    var id = UUID().uuidString
    var title: String
    var org: String
    var cvSection: String
    var cvLine: String
    var skills: [String] = []
    var added = Date()
}

/// A listing the student is tracking on "My path".
struct Track: Codable, Equatable {
    var status: TrackStatus
    var updated: Date
    var cvLine: String?
}

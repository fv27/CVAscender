import Foundation

/// The matching engine — a Swift port of the website's lib/matching.js.
/// Plain rules: transparent, instant and offline.
struct Match {
    let score: Int
    let eligible: Bool
    let reasons: [String]
    let warnings: [String]

    var explanation: String {
        reasons.isEmpty ? "A wider pick to help you explore something new." : reasons.prefix(2).joined(separator: ". ") + "."
    }
}

struct Ranked: Identifiable {
    let o: Opportunity
    let m: Match
    var id: String { o.id }
}

enum Matcher {
    private static let travelGroups: Set<String> = ["research", "university", "olympiad"]
    private static let dimInterests: [String: [String]] = [
        "leadership": ["leadership", "business"],
        "work": ["business", "technology", "science", "health"],
        "community": ["volunteering", "environment", "health"],
        "competitions": ["technology", "science", "academic"],
        "academic": ["academic", "science", "health"],
        "teamwork": ["sports", "arts"],
        "international": ["academic", "leadership", "arts"],
    ]

    static func sameTown(_ o: Opportunity, _ p: Profile) -> Bool {
        guard let city = o.city, !p.city.isEmpty else { return false }
        let key = Catalog.normalize(p.city.trimmingCharacters(in: .whitespaces))
        return ([city] + (o.aliases ?? [])).contains { Catalog.normalize($0) == key }
    }

    static func isVisible(_ o: Opportunity, _ p: Profile, anyCanton: Bool) -> Bool {
        // Own country's listings plus worldwide ones (no country).
        if let c = o.country, c != p.country { return false }
        if !anyCanton, o.scope == "local", let c = o.canton, c != p.canton { return travelGroups.contains(o.group) }
        if !anyCanton, o.finder == "town" { return sameTown(o, p) }
        return true
    }

    private static func listify(_ a: [String]) -> String {
        a.count <= 1 ? a.joined() : a.dropLast().joined(separator: ", ") + " and " + a.last!
    }

    static func match(_ o: Opportunity, _ p: Profile, gaps: [String] = []) -> Match {
        let cat = Catalog.shared
        var reasons: [String] = []
        var warnings: [String] = []
        var score = 12.0
        var eligible = true

        if let min = o.minAge, p.age < min { eligible = false; warnings.append("Open from age \(min)") }
        if let max = o.maxAge, p.age > max { eligible = false; warnings.append("Up to age \(max)") }
        if let min = o.minYear, p.year < min { eligible = false; warnings.append("From year \(min)") }
        if let max = o.maxYear, p.year > max { eligible = false; warnings.append("Up to year \(max)") }
        if let only = o.cantons, !only.isEmpty, !p.canton.isEmpty, !only.contains(p.canton) {
            eligible = false
            warnings.append("Only for students in " + only.map { cat.cantonName($0) }.joined(separator: ", "))
        }

        let interestHits = o.categories.filter { p.interests.contains($0) }
        score += Double(min(interestHits.count, 2)) * 20
        if !interestHits.isEmpty { reasons.append("Matches your interest in " + listify(interestHits.map { cat.interestLabel($0) })) }

        let skillHits = o.skills.filter { p.skills.contains($0) }
        score += Double(min(skillHits.count, 2)) * 12.5
        if !skillHits.isEmpty { reasons.append("Builds " + listify(Array(skillHits.prefix(2))) + ", which you want to develop") }

        let sameCity = sameTown(o, p)
        let sameCanton = o.canton != nil && o.canton == p.canton
        if sameCity { score += 15; reasons.append("In \(o.city ?? ""), near you") }
        else if sameCanton { score += 12; reasons.append("In your \(cat.country(p.country).regionLabel.lowercased()) (\(cat.cantonName(p.canton)))") }
        else if o.format == "online" {
            score += 10
            reasons.append(o.scope == "global" ? "Online — join from anywhere" : "Online — join from anywhere in \(cat.country(p.country).name)")
        }
        if o.scope == "global" { score -= 12 }
        if o.type == "Youth bank account" { score -= 20 }
        if !o.verified { score -= 6 }
        else if o.city == nil { score += 8; reasons.append("Open to students across \(cat.country(p.country).name)") }
        else { score += 3 }
        if o.finder != nil { score -= 4 }
        if o.format != "online", let city = o.city, !sameCity, !sameCanton, o.scope == "local" { warnings.append("Takes place in \(city)") }
        if o.scope == "global", o.format != "online" { warnings.append("Abroad (\(o.city ?? "abroad")) — check travel, visa and costs") }
        if !o.verified { warnings.append("Details not checked yet — confirm on the official website") }

        if let days = o.daysLeft, days >= 0, days <= 7 { score += 5; reasons.append("Deadline is coming up soon") }

        if let dim = o.dim, gaps.contains(dim) {
            score += 8
            reasons.append("Fills a gap in your CV: " + (cat.file.dimensions.first { $0.id == dim }?.label ?? dim))
        }

        if !eligible { score *= 0.5 }
        return Match(score: max(5, min(99, Int(score.rounded()))), eligible: eligible, reasons: reasons, warnings: warnings)
    }

    /// Ranked feed with a little variety (never three of the same category in a row).
    static func rank(_ list: [Opportunity], _ p: Profile, gaps: [String], anyCanton: Bool) -> [Ranked] {
        let scored = list.filter { isVisible($0, p, anyCanton: anyCanton) }
            .map { Ranked(o: $0, m: match($0, p, gaps: gaps)) }
            .sorted { $0.m.score > $1.m.score }
        // Work with indices so we only move small integers around.
        var pool = Array(scored.indices)
        var out: [Ranked] = []
        out.reserveCapacity(scored.count)
        while !pool.isEmpty {
            let last = out.suffix(2).map { $0.o.categories.first ?? "" }
            let pick = pool.firstIndex { idx in
                let category = scored[idx].o.categories.first ?? ""
                return !(last.count == 2 && last.allSatisfy { $0 == category })
            } ?? 0
            out.append(scored[pool.remove(at: pick)])
        }
        return out
    }

    /// Every word of the query must appear somewhere in the listing.
    static func matches(_ o: Opportunity, query: String) -> Bool {
        let words = Catalog.normalize(query).split(whereSeparator: { $0.isWhitespace }).map(String.init)
        guard !words.isEmpty else { return true }
        let hay = Catalog.shared.haystacks[o.id] ?? ""
        return words.allSatisfy { hay.contains($0) }
    }

    /// Which CV dimension a CV section counts towards (for own activities).
    static func dim(forSection section: String) -> String {
        switch section {
        case "Leadership & responsibility": return "leadership"
        case "Work experience": return "work"
        case "Competitions & awards": return "competitions"
        case "Academic programmes": return "academic"
        case "Volunteering": return "community"
        case "International experience": return "international"
        default: return "teamwork"
        }
    }

    /// CV gap analysis — a port of the website's analyseCV.
    static func analyse(profile p: Profile, tracks: [String: Track], custom: [CustomActivity]) -> CVAnalysis {
        let cat = Catalog.shared
        var done: [String: Int] = [:]
        var active: [String: Int] = [:]
        for (id, t) in tracks {
            guard let dim = cat.byId[id]?.dim else { continue }
            if t.status == .completed { done[dim, default: 0] += 1 }
            if t.status == .applied { active[dim, default: 0] += 1 }
        }
        for c in custom { done[dim(forSection: c.cvSection), default: 0] += 1 }
        let dims = cat.file.dimensions.map { d -> CVDimension in
            let relevance = (dimInterests[d.id] ?? []).filter { p.interests.contains($0) }.count
            let status: CVDimension.Status = (done[d.id] ?? 0) > 0 ? .strong : (active[d.id] ?? 0) > 0 ? .building : .gap
            return CVDimension(d: d, completed: done[d.id] ?? 0, inProgress: active[d.id] ?? 0, relevance: relevance, status: status)
        }
        let gaps = dims.filter { $0.status == .gap }.sorted { $0.relevance > $1.relevance }.map(\.d.id)
        let covered = dims.filter { $0.status != .gap }.count
        let coverage = dims.isEmpty ? 0 : Int((Double(covered) / Double(dims.count) * 100).rounded())
        return CVAnalysis(dims: dims, gaps: gaps, coverage: coverage)
    }

    /// Short advice per CV dimension (shown in the gap analysis).
    static func advice(for dim: String) -> String {
        switch dim {
        case "leadership": return "Leading something — a club, a team, a project — shows you can take responsibility for people."
        case "work": return "A short internship or work-experience week shows you can operate in a real workplace."
        case "community": return "Volunteering shows you give time to something bigger than yourself."
        case "competitions": return "A hackathon or academic competition gives you a concrete result to point to."
        case "academic": return "A university programme, summer school or online course shows you learn beyond the syllabus."
        case "teamwork": return "Sticking with a team or ensemble for a season shows commitment."
        case "international": return "A language exchange or international programme shows you can work across cultures."
        default: return ""
        }
    }
}

struct CVDimension: Identifiable {
    enum Status { case strong, building, gap }
    let d: Dimension
    let completed: Int
    let inProgress: Int
    let relevance: Int
    let status: Status
    var id: String { d.id }
    var statusLabel: String {
        switch status {
        case .strong: return "Strong"
        case .building: return "Building"
        case .gap: return "Gap"
        }
    }
}

struct CVAnalysis {
    let dims: [CVDimension]
    let gaps: [String]
    let coverage: Int
}

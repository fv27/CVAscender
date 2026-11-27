import Foundation

/// All listings and vocabularies, loaded once from opportunities.json in the app bundle.
final class Catalog {
    static let shared = Catalog()

    let file: CatalogFile
    let byId: [String: Opportunity]
    /// Lower-cased, accent-free search text per listing.
    let haystacks: [String: String]

    private init() {
        guard let url = Bundle.main.url(forResource: "opportunities", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode(CatalogFile.self, from: data) else {
            fatalError("opportunities.json is missing or invalid — run `npm run ios:data` in the cvascender folder.")
        }
        file = decoded
        byId = Dictionary(decoded.opportunities.map { ($0.id, $0) }, uniquingKeysWith: { a, _ in a })
        let cantonNames = Dictionary(decoded.cantons.map { ($0.code, $0.name) }, uniquingKeysWith: { a, _ in a })
        let interestLabels = Dictionary(decoded.interests.map { ($0.id, $0.label) }, uniquingKeysWith: { a, _ in a })
        var hay: [String: String] = [:]
        for o in decoded.opportunities {
            var parts: [String] = [o.title, o.org, o.type, o.description]
            parts.append(o.city ?? "")
            parts.append(o.canton ?? "")
            if let code = o.canton, let name = cantonNames[code] { parts.append(name) }
            if let sport = o.sport { parts.append(sport) }
            parts.append(contentsOf: o.aliases ?? [])
            for c in o.categories { parts.append(interestLabels[c] ?? c) }
            hay[o.id] = Catalog.normalize(parts.joined(separator: " "))
        }
        haystacks = hay
    }

    var opportunities: [Opportunity] { file.opportunities }

    func cantonName(_ code: String) -> String { file.cantons.first { $0.code == code }?.name ?? code }
    func regions(for country: String) -> [Canton] { file.cantons.filter { $0.country == country } }
    func schoolYears(for country: String) -> [SchoolYear] { country == "GB" ? file.ukSchoolYears : file.schoolYears }
    func country(_ code: String) -> CountryInfo { file.countries.first { $0.code == code } ?? file.countries[0] }
    func yearLabel(_ year: Int, country: String) -> String { schoolYears(for: country).first { $0.value == year }?.label ?? "Year \(year)" }
    /// "UK-NW" → "NW" (short code shown on region tiles).
    func shortCode(_ code: String) -> String { code.replacingOccurrences(of: "UK-", with: "") }
    func interest(_ id: String) -> Interest? { file.interests.first { $0.id == id } }
    func interestLabel(_ id: String) -> String { interest(id)?.label ?? id }

    static func normalize(_ s: String) -> String {
        s.folding(options: [.diacriticInsensitive, .caseInsensitive], locale: Locale(identifier: "en_US_POSIX"))
    }
}

/// "What kind of thing is it?" — same groups as the website's Type filter.
enum Kind: String, CaseIterable, Identifiable {
    case research, essay, olympiad, competition, university, camp, club, civic, work, money
    var id: String { rawValue }
    var label: String {
        switch self {
        case .research: return "Research programmes"
        case .essay: return "Essays & writing"
        case .olympiad: return "Olympiads"
        case .competition: return "Competitions & hackathons"
        case .university: return "University & summer"
        case .camp: return "Camps & courses"
        case .club: return "Clubs & teams"
        case .civic: return "Volunteering & civic"
        case .work: return "Jobs & apprenticeships"
        case .money: return "Money & banking"
        }
    }
    /// Short name for filter pills.
    var shortLabel: String {
        switch self {
        case .research: return "Research"
        case .essay: return "Writing"
        case .olympiad: return "Olympiads"
        case .competition: return "Competitions"
        case .university: return "University"
        case .camp: return "Camps & courses"
        case .club: return "Clubs & teams"
        case .civic: return "Volunteering"
        case .work: return "Work experience"
        case .money: return "Money"
        }
    }
    /// Same icons as the website's Explore page.
    var emoji: String {
        switch self {
        case .research: return "🔬"
        case .essay: return "✍️"
        case .olympiad: return "🏅"
        case .competition: return "🏆"
        case .university: return "🎓"
        case .camp: return "⛺"
        case .club: return "⚽"
        case .civic: return "🤝"
        case .work: return "💼"
        case .money: return "💰"
        }
    }
    var symbol: String {
        switch self {
        case .research: return "flask.fill"
        case .essay: return "pencil.and.outline"
        case .olympiad: return "medal.fill"
        case .competition: return "trophy.fill"
        case .university: return "graduationcap.fill"
        case .camp: return "tent.fill"
        case .club: return "figure.run"
        case .civic: return "hands.sparkles.fill"
        case .work: return "briefcase.fill"
        case .money: return "banknote.fill"
        }
    }
    static func of(_ o: Opportunity) -> Kind { Kind(rawValue: o.group) ?? .club }
}

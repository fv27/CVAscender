import SwiftUI

/// Explore — the website's page: a big headline and search bar, recent searches,
/// "Browse by type", suggestion pills, then an endless two-column photo grid.
struct ExploreView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @AppStorage("cva.recentSearches") private var recentRaw = "[]"
    @State private var query = ""
    @State private var kind: Kind?
    @State private var results: [Ranked] = []
    @State private var shown = 12
    @State private var headline = Headlines.all.randomElement() ?? Headlines.all[0]
    @FocusState private var focused: Bool

    private var trimmed: String { String(query.trimmingCharacters(in: .whitespaces).prefix(80)) }
    private var searching: Bool { !trimmed.isEmpty || kind != nil }
    private var recent: [String] { (try? JSONDecoder().decode([String].self, from: Data(recentRaw.utf8))) ?? [] }

    private struct Suggestion: Identifiable {
        let label: String
        let query: String
        var id: String { label }
    }
    private static let suggestions: [Suggestion] = [
        Suggestion(label: "Research", query: "research"), Suggestion(label: "Essay competitions", query: "essay"),
        Suggestion(label: "Hackathon", query: "hackathon"), Suggestion(label: "Football", query: "football"),
        Suggestion(label: "Summer at university", query: "university"), Suggestion(label: "Volunteering", query: "volunteering"),
        Suggestion(label: "Robotics", query: "robotics"), Suggestion(label: "Startup", query: "startup"),
    ]
    private struct Key: Hashable { let q: String; let kind: String? }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                HStack { Spacer(); ThemeToggle() }
                    .padding(.horizontal, 16)
                hero
                resultsSection
            }
            .padding(.bottom, 110)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(Color.paper.ignoresSafeArea())
        .task(id: Key(q: trimmed, kind: kind?.rawValue)) {
            try? await Task.sleep(nanoseconds: 120_000_000)
            if Task.isCancelled { return }
            shown = 12
            results = compute()
        }
        .task(id: trimmed) {
            // Remember a search once typing stops for a moment (like the website).
            guard trimmed.count >= 3 else { return }
            try? await Task.sleep(nanoseconds: 1_200_000_000)
            if Task.isCancelled { return }
            remember(trimmed)
        }
        .onChange(of: store.profile) { results = compute() }
    }

    // MARK: Hero

    private var hero: some View {
        VStack(spacing: 0) {
            if !searching {
                headlineText
                    .multilineTextAlignment(.center)
                    .padding(.top, 36)
                    .padding(.bottom, 26)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
            searchBar
            if !searching {
                if !recent.isEmpty { recentSearches }
                browseByType
                suggestionPills
                VStack(spacing: 4) {
                    Text("Recommended for you").font(.geist(12, .medium)).foregroundStyle(Color.inkMuted)
                    Image(systemName: "arrow.down").font(.system(size: 14, weight: .semibold)).foregroundStyle(Color.inkMuted)
                        // Gentle up-and-down bounce that works on iOS 17 (symbolEffect .bounce
                        // repeating forever needs iOS 18).
                        .phaseAnimator([0.0, 5.0]) { view, y in view.offset(y: y) } animation: { _ in .easeInOut(duration: 0.8) }
                }
                .padding(.top, 36)
                .padding(.bottom, 14)
            }
        }
        .padding(.horizontal, 20)
        .animation(.easeInOut(duration: 0.35), value: searching)
    }

    private var headlineText: some View {
        let filled = Headlines.fill(headline, name: store.profile?.name ?? "")
        let parts = filled.components(separatedBy: "*")
        var text = Text("")
        for (i, part) in parts.enumerated() {
            text = text + Text(part).foregroundColor(i % 2 == 1 ? .pumpkin : .ink)
        }
        return text.display(40)
    }

    private var searchBar: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass").font(.system(size: 19, weight: .medium)).foregroundStyle(Color.inkMuted)
            TextField("Search programmes, clubs, towns…", text: $query)
                .font(.geist(17))
                .foregroundStyle(Color.ink)
                .focused($focused)
                .submitLabel(.search)
                .autocorrectionDisabled()
            if !query.isEmpty {
                Button { query = "" } label: { Image(systemName: "xmark").font(.system(size: 15, weight: .semibold)).foregroundStyle(Color.inkMuted) }
                    .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, 20)
        .frame(height: searching ? 56 : 64)
        .background(Color.card, in: Capsule())
        .overlay(Capsule().strokeBorder(focused ? Color.pumpkin : Color.line, lineWidth: 2))
        .shadow(color: Color(UIColor(hex: 0x101828)).opacity(0.08), radius: 20, y: 10)
        .padding(.top, searching ? 8 : 0)
    }

    private var recentSearches: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Recent searches").monoLabel()
                Spacer()
                Button("Clear") { recentRaw = "[]" }.font(.geist(12, .semibold)).foregroundStyle(Color.inkMuted)
            }
            FlowLayout {
                ForEach(recent, id: \.self) { r in
                    Button { query = r } label: {
                        HStack(spacing: 6) { Image(systemName: "clock").font(.system(size: 12)); Text(r) }
                            .font(.geist(14))
                            .foregroundStyle(Color.inkSoft)
                            .padding(.horizontal, 12).frame(height: 32)
                            .background(Color.card, in: Capsule())
                            .overlay(Capsule().strokeBorder(Color.line))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(.top, 20)
    }

    private var browseByType: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Browse by type").monoLabel()
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)], spacing: 8) {
                ForEach(Kind.allCases) { k in
                    let n = Self.counts[k] ?? 0
                    if n > 0 {
                        Button { kind = k; focused = false } label: {
                            HStack(spacing: 10) {
                                Text(k.emoji).font(.system(size: 18))
                                    .frame(width: 36, height: 36)
                                    .background(Color.soft, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(k.label).font(.geist(14, .semibold)).foregroundStyle(Color.ink).lineLimit(2)
                                        .multilineTextAlignment(.leading)
                                    Text("\(n)").font(.geist(12)).foregroundStyle(Color.inkMuted)
                                }
                                Spacer(minLength: 0)
                            }
                            .padding(12)
                            .frame(minHeight: 66)
                            .background(Color.card, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                            .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(Color.line))
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 24)
    }

    private var suggestionPills: some View {
        FlowLayout {
            ForEach(Self.suggestions) { s in
                Button { query = s.query } label: {
                    Text(s.label).font(.geist(14, .medium)).foregroundStyle(Color.inkSoft)
                        .padding(.horizontal, 14).frame(height: 34)
                        .background(Color.soft, in: Capsule())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.top, 20)
    }

    // MARK: Results / recommendations

    private var resultsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            if searching {
                HStack(spacing: 8) {
                    if let kind {
                        Button { self.kind = nil } label: {
                            HStack(spacing: 6) { Text("\(kind.emoji) \(kind.label)"); Image(systemName: "xmark").font(.system(size: 11, weight: .bold)) }
                                .font(.geist(13, .semibold))
                                .foregroundStyle(Color.paper)
                                .padding(.horizontal, 12).frame(height: 30)
                                .background(Color.ink, in: Capsule())
                        }
                        .buttonStyle(.plain)
                    }
                    Text("\(results.count) result\(results.count == 1 ? "" : "s")" + (trimmed.isEmpty ? "" : " for “\(trimmed)”"))
                        .font(.geist(14)).foregroundStyle(Color.inkMuted)
                }
                .padding(.top, 16)
                if results.isEmpty {
                    VStack(spacing: 8) {
                        Text("No matches").display(30).foregroundStyle(Color.ink)
                        Text("Try another word or a town name.").font(.geist(15)).foregroundStyle(Color.inkSoft)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 60)
                }
            }
            MasonryGrid(items: Array(results.prefix(shown)))
            if shown < results.count {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 20)
                    .onAppear { shown = min(shown + 12, results.count) }
            } else if !results.isEmpty {
                Text("That’s everything for now.").font(.geist(14)).foregroundStyle(Color.inkMuted)
                    .frame(maxWidth: .infinity).padding(.vertical, 24)
            }
        }
        .padding(.horizontal, 14)
    }

    private static let counts: [Kind: Int] = {
        var c: [Kind: Int] = [:]
        for o in Catalog.shared.opportunities { c[Kind.of(o), default: 0] += 1 }
        return c
    }()

    private func compute() -> [Ranked] {
        guard let p = store.profile else { return [] }
        let ranked = Matcher.rank(Catalog.shared.opportunities, p, gaps: store.gaps, anyCanton: searching)
        if !searching { return ranked.filter { $0.m.eligible } }
        return ranked.filter { r in
            (kind == nil || r.o.group == kind?.rawValue) && Matcher.matches(r.o, query: trimmed)
        }
    }

    private func remember(_ q: String) {
        var list = recent.filter { $0.lowercased() != q.lowercased() }
        list.insert(q, at: 0)
        if let data = try? JSONEncoder().encode(Array(list.prefix(6))), let s = String(data: data, encoding: .utf8) { recentRaw = s }
    }
}

/// Two columns of picture tiles; every third tile is taller (website masonry).
struct MasonryGrid: View {
    let items: [Ranked]

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            column(0)
            column(1)
        }
    }

    private struct Cell: Identifiable {
        let index: Int
        let r: Ranked
        var id: String { r.id }
    }

    private func column(_ c: Int) -> some View {
        let cells = items.indices.filter { $0 % 2 == c }.map { Cell(index: $0, r: items[$0]) }
        return LazyVStack(spacing: 12) {
            ForEach(cells) { cell in
                ExploreTile(r: cell.r, tall: cell.index % 3 == 0)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

/// Picture tile: image, title and where/when, with a save button.
struct ExploreTile: View {
    let r: Ranked
    let tall: Bool
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router

    var body: some View {
        let o = r.o
        let saved = store.isSaved(o.id)
        Button { router.open(o) } label: {
            Color.clear
                .aspectRatio(tall ? 3 / 4.4 : 4 / 5, contentMode: .fit)
                .overlay { ListingVisual(o: o, caption: false) }
                .overlay(LinearGradient(colors: [.black.opacity(0.8), .black.opacity(0.15), .clear], startPoint: .bottom, endPoint: .top))
                .overlay(alignment: .bottomLeading) {
                    VStack(alignment: .leading, spacing: 4) {
                        if !r.m.eligible { PhotoTag(text: "Not eligible yet", style: .red) }
                        Text(o.title).font(.geist(15, .bold)).foregroundStyle(.white).lineLimit(3).multilineTextAlignment(.leading)
                        Text(subtitle(o)).font(.geist(12)).foregroundStyle(.white.opacity(0.8)).lineLimit(1)
                    }
                    .padding(14)
                }
                .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        }
        .buttonStyle(.plain)
        .overlay(alignment: .topTrailing) {
            Button {
                store.toggleSaved(o.id)
                router.notify(store.isSaved(o.id) ? "Saved to My path" : "Removed")
            } label: {
                Image(systemName: saved ? "bookmark.fill" : "bookmark")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(saved ? Color(UIColor(hex: 0xFF7518)) : .white)
                    .frame(width: 36, height: 36)
                    .background {
                        if saved { Circle().fill(.white) } else { Circle().fill(.black.opacity(0.3)) }
                    }
            }
            .buttonStyle(.plain)
            .padding(10)
            .accessibilityLabel(saved ? "Saved" : "Save")
        }
    }

    private func subtitle(_ o: Opportunity) -> String {
        guard let d = o.deadlineDate, (o.daysLeft ?? -1) >= 0 else { return o.locationLabel }
        return o.locationLabel + " · by " + d.formatted(.dateTime.day().month(.abbreviated))
    }
}

/// Random Explore headlines (lib/headlines.js). *word* is orange; {name} is the first name.
enum Headlines {
    static let all = [
        "Ready to *collegemaxx*, {name}?", "*Collegemaxxing* awaits, {name}.", "Time to *ascend*, {name}.",
        "Time to *collegemaxx*, {name}.", "Time to *CVMaxx*, {name}.", "Ready to *ascend*, {name}?",
        "Ready to *CV mog* your friends, {name}?", "Your CV is still *ascending*, {name}.", "What do you want to *try*?",
        "What will you *build* next?", "Find your next *adventure*.", "What are you *curious* about?",
        "Your next big *step* starts here.", "Time to build your *CV*.",
    ]

    static func fill(_ line: String, name: String) -> String {
        let n = name.trimmingCharacters(in: .whitespaces)
        if !n.isEmpty { return line.replacingOccurrences(of: "{name}", with: n) }
        return line.replacingOccurrences(of: ", {name}", with: "").replacingOccurrences(of: "{name}", with: "")
    }
}

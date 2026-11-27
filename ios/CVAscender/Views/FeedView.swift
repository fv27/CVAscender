import SwiftUI

/// Filters for the Discover feed (the website's FilterPanel).
struct FeedFilters: Equatable {
    var query = ""
    var canton: String? = nil           // nil = near me, "all", or a canton code
    var kind: Kind? = nil
    var categories: Set<String> = []
    var format = "all"                  // all, online, in-person
    var showIneligible = false

    var activeCount: Int {
        (query.isEmpty ? 0 : 1) + (canton == nil ? 0 : 1) + (kind == nil ? 0 : 1) + categories.count
            + (format == "all" ? 0 : 1) + (showIneligible ? 1 : 0)
    }
    var wide: Bool { !query.trimmingCharacters(in: .whitespaces).isEmpty || canton != nil }
}

/// Discover: full-screen snap-scrolling reels (TikTok pattern, like the website's feed).
struct FeedView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @State private var ranked: [Ranked] = []
    @State private var filters = FeedFilters()
    @State private var sort = "foryou"           // foryou | deadline
    @State private var showFilters = false
    @State private var current: String?

    private var items: [Ranked] {
        let q = filters.query.trimmingCharacters(in: .whitespaces)
        var list = ranked.filter { r in
            let o = r.o
            if !q.isEmpty && !Matcher.matches(o, query: q) { return false }
            if let c = filters.canton, c != "all", o.canton != c { return false }
            if let k = filters.kind, o.group != k.rawValue { return false }
            if !filters.categories.isEmpty && filters.categories.isDisjoint(with: o.categories) { return false }
            if filters.format == "online" && o.format != "online" { return false }
            if filters.format == "in-person" && o.format == "online" { return false }
            if !filters.showIneligible && !r.m.eligible && q.isEmpty { return false }
            return true
        }
        if sort == "deadline" {
            list = list.filter { ($0.o.daysLeft ?? -1) >= 0 }.sorted { ($0.o.daysLeft ?? 999) < ($1.o.daysLeft ?? 999) }
        }
        return list
    }

    var body: some View {
        GeometryReader { geo in
            let top: CGFloat = geo.safeAreaInsets.top + 92      // below the header
            let bottom: CGFloat = geo.safeAreaInsets.bottom + 70 // above the floating tab bar
            ZStack(alignment: .top) {
                Color.paper.ignoresSafeArea()
                let list = items
                if list.isEmpty {
                    emptyState.padding(.top, top + 40)
                } else {
                    ScrollView(.vertical) {
                        LazyVStack(spacing: 0) {
                            ForEach(list) { r in
                                ReelCard(r: r)
                                    .padding(.horizontal, 10)
                                    .padding(.top, top)
                                    .padding(.bottom, bottom)
                                    .frame(height: geo.size.height + geo.safeAreaInsets.top + geo.safeAreaInsets.bottom)
                                    .id(r.id)
                            }
                        }
                        .scrollTargetLayout()
                    }
                    .scrollTargetBehavior(.paging)
                    .scrollIndicators(.hidden)
                    .scrollPosition(id: $current)
                    .ignoresSafeArea()
                }
                header
            }
        }
        .sheet(isPresented: $showFilters) {
            FilterSheet(filters: $filters, total: items.count)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
        .onAppear(perform: recompute)
        .onChange(of: store.profile) { recompute() }
        .onChange(of: filters.wide) { recompute() }
        .onChange(of: filters) { current = items.first?.id }
        .onChange(of: sort) { current = items.first?.id }
    }

    /// Logo, Filters and theme button, then "For you / Closing soon" tabs (website's mobile top bar).
    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                Logo(size: 19)
                Spacer()
                Button { showFilters = true } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "slider.horizontal.3").font(.system(size: 14, weight: .semibold))
                        Text("Filters").font(.geist(13, .semibold))
                        if filters.activeCount > 0 {
                            Text("\(filters.activeCount)")
                                .font(.geist(10, .bold)).foregroundStyle(.white)
                                .frame(minWidth: 16, minHeight: 16)
                                .background(Color.pumpkin, in: Capsule())
                        }
                    }
                    .foregroundStyle(Color.ink)
                    .padding(.horizontal, 12)
                    .frame(height: 36)
                    .background(Color.soft, in: Capsule())
                }
                .buttonStyle(.plain)
                ThemeToggle()
            }
            HStack(spacing: 22) {
                sortTab("For you", "foryou")
                sortTab("Closing soon", "deadline")
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
        .padding(.bottom, 10)
        .background(
            LinearGradient(colors: [Color.paper, Color.paper.opacity(0.95), Color.paper.opacity(0)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea(edges: .top)
        )
    }

    private func sortTab(_ label: String, _ id: String) -> some View {
        Button { withAnimation(.easeOut(duration: 0.2)) { sort = id } } label: {
            VStack(spacing: 6) {
                Text(label)
                    .font(.geist(15, sort == id ? .semibold : .medium))
                    .foregroundStyle(sort == id ? Color.ink : Color.inkMuted)
                Capsule().fill(sort == id ? Color.pumpkin : .clear).frame(width: 28, height: 3)
            }
        }
        .buttonStyle(.plain)
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Text("Nothing here yet").display(30).foregroundStyle(Color.ink)
            Text(sort == "deadline" ? "No published deadlines match these filters right now." : "Try fewer filters, or search everything in Explore.")
                .font(.geist(15)).foregroundStyle(Color.inkSoft).multilineTextAlignment(.center)
            HStack {
                if filters.activeCount > 0 {
                    Button("Clear filters") { filters = FeedFilters() }.buttonStyle(.pill(.ghost))
                }
                Button("Go to Explore") { router.tab = .explore }.buttonStyle(.pill)
            }
        }
        .padding(.horizontal, 32)
    }

    private func recompute() {
        guard let p = store.profile else { return }
        ranked = Matcher.rank(Catalog.shared.opportunities, p, gaps: store.gaps, anyCanton: filters.wide)
    }
}

/// One full-screen reel: photo fills the card, tags/title bottom-left, actions down the right.
struct ReelCard: View {
    let r: Ranked
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @State private var burst = 0

    var body: some View {
        let o = r.o
        let saved = store.isSaved(o.id)
        let status = store.status(of: o.id)
        ZStack(alignment: .bottomLeading) {
            ListingVisual(o: o, credit: true)
                .overlay(LinearGradient(colors: [.black.opacity(0.85), .black.opacity(0.2), .black.opacity(0.1)], startPoint: .bottom, endPoint: .top))
                .contentShape(Rectangle())
                .onTapGesture(count: 2) {
                    if !saved { store.toggleSaved(o.id) }
                    burst += 1
                }
                .onTapGesture { router.open(o) }

            if burst > 0 {
                Image(systemName: "bookmark.fill")
                    .font(.system(size: 96))
                    .foregroundStyle(.white)
                    .shadow(radius: 12)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .phaseAnimator([0.0, 1.0, 0.0], trigger: burst) { view, phase in
                        view.scaleEffect(0.6 + phase * 0.5).opacity(phase)
                    }
                    .allowsHitTesting(false)
            }

            // Bottom-left: scope, tags, title, short description
            VStack(alignment: .leading, spacing: 10) {
                FlowLayout(spacing: 6) {
                    PhotoTag(text: o.scopeLabel, style: .white)
                    ForEach(o.categories, id: \.self) { c in
                        Button {
                            router.tab = .explore
                        } label: {
                            PhotoTag(text: Catalog.shared.interestLabel(c), dot: Color.hue(c))
                        }
                        .buttonStyle(.plain)
                    }
                    if !o.verified { PhotoTag(text: "Not checked yet", style: .amber) }
                    if !r.m.eligible { PhotoTag(text: "Not eligible yet" + (r.m.warnings.first.map { " · \($0)" } ?? ""), style: .red) }
                }
                Text(o.title)
                    .display(28)
                    .foregroundStyle(.white)
                    .lineLimit(3)
                Text(o.description)
                    .font(.geist(14.5))
                    .foregroundStyle(.white.opacity(0.85))
                    .lineLimit(2)
            }
            .padding(20)
            .padding(.trailing, 64)
            .contentShape(Rectangle())
            .onTapGesture { router.open(o) }

            // Right action rail
            VStack(spacing: 14) {
                Button { router.open(o) } label: { OrgLogo(o: o, size: 46) }.buttonStyle(.plain)
                MatchRing(score: r.m.score)
                railButton(saved ? "Saved" : "Save", icon: saved ? "bookmark.fill" : "bookmark", active: saved) {
                    store.toggleSaved(o.id)
                    router.notify(store.isSaved(o.id) ? "Saved to My path" : "Removed")
                }
                if let url = o.linkURL {
                    ShareLink(item: url, subject: Text(o.title), message: Text("\(o.title) — found on CVAscender")) {
                        railLabel("Share", icon: "square.and.arrow.up", active: false)
                    }
                    .buttonStyle(.plain)
                }
                Button { router.open(o) } label: {
                    VStack(spacing: 4) {
                        Image(systemName: status == nil ? "arrow.right" : "checkmark")
                            .font(.system(size: 20, weight: .semibold))
                            .frame(width: 48, height: 48)
                            .background(Color(UIColor(hex: 0xFF7518)), in: Circle())
                            .shadow(color: .black.opacity(0.25), radius: 8, y: 3)
                        Text(status == .applied ? "Applied" : status == .completed ? "Done" : "Apply")
                            .font(.geist(11, .semibold))
                    }
                    .foregroundStyle(.white)
                }
                .buttonStyle(.plain)
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
            .padding(.trailing, 12)
            .padding(.bottom, 24)
        }
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .shadow(color: .black.opacity(0.12), radius: 16, y: 8)
        .sensoryFeedback(.impact(weight: .medium), trigger: burst)
    }

    private func railButton(_ label: String, icon: String, active: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) { railLabel(label, icon: icon, active: active) }.buttonStyle(.plain)
    }

    private func railLabel(_ label: String, icon: String, active: Bool) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .frame(width: 48, height: 48)
                .background {
                    if active { Circle().fill(Color(UIColor(hex: 0x26619C))) } else { Circle().fill(.ultraThinMaterial) }
                }
            Text(label).font(.geist(11, .semibold))
        }
        .foregroundStyle(.white)
    }
}

/// Search and filters (website FilterPanel): search, canton, type, interests, format.
struct FilterSheet: View {
    @Binding var filters: FeedFilters
    let total: Int
    @EnvironmentObject private var store: StudentStore
    @Environment(\.dismiss) private var dismiss
    private let cat = Catalog.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass").foregroundStyle(Color.inkMuted)
                        TextField("Football, robotics, essay, a town…", text: $filters.query)
                            .font(.geist(16))
                            .submitLabel(.search)
                        if !filters.query.isEmpty {
                            Button { filters.query = "" } label: { Image(systemName: "xmark.circle.fill").foregroundStyle(Color.inkMuted) }
                        }
                    }
                    .padding(.horizontal, 16)
                    .frame(height: 50)
                    .background(Color.card, in: Capsule())
                    .overlay(Capsule().strokeBorder(Color.line, lineWidth: 2))

                    group("Where") {
                        Chip(label: "Near me", selected: filters.canton == nil) { filters.canton = nil }
                        Chip(label: "All of Switzerland", selected: filters.canton == "all") { filters.canton = "all" }
                        Menu {
                            ForEach(cat.regions(for: country), id: \.code) { c in Button(c.name) { filters.canton = c.code } }
                        } label: {
                            let picked = filters.canton.flatMap { $0 == "all" ? nil : cat.cantonName($0) }
                            HStack(spacing: 4) { Text(picked ?? "Pick a canton"); Image(systemName: "chevron.down").font(.caption) }
                                .font(.geist(14, .medium))
                                .padding(.horizontal, 14).frame(height: 36)
                                .foregroundStyle(picked != nil ? Color.white : Color.inkSoft)
                                .background(picked != nil ? Color.lapis : Color.card, in: Capsule())
                                .overlay(Capsule().strokeBorder(picked != nil ? Color.lapis : Color.line))
                        }
                    }
                    group("Type") {
                        ForEach(Kind.allCases) { k in
                            Chip(label: k.label, icon: k.emoji, selected: filters.kind == k) { filters.kind = filters.kind == k ? nil : k }
                        }
                    }
                    group("Interests") {
                        ForEach(cat.file.interests, id: \.id) { i in
                            Chip(label: i.label, selected: filters.categories.contains(i.id)) {
                                if filters.categories.contains(i.id) { filters.categories.remove(i.id) } else { filters.categories.insert(i.id) }
                            }
                        }
                    }
                    group("Format") {
                        Chip(label: "Any", selected: filters.format == "all") { filters.format = "all" }
                        Chip(label: "Online", selected: filters.format == "online") { filters.format = "online" }
                        Chip(label: "In person", selected: filters.format == "in-person") { filters.format = "in-person" }
                    }
                    Toggle(isOn: $filters.showIneligible) {
                        Text("Include ones I’m not eligible for yet").font(.geist(15, .medium)).foregroundStyle(Color.ink)
                    }
                    .tint(Color.pumpkin)
                }
                .padding(20)
            }
            .background(Color.paper)
            .navigationTitle("Search & filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    if filters.activeCount > 0 { Button("Clear all") { filters = FeedFilters() } }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Show \(total)") { dismiss() }.font(.geist(15, .semibold))
                }
            }
        }
    }

    private var country: String { store.profile?.country ?? "CH" }

    private func group<Content: View>(_ title: String, @ViewBuilder _ content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).monoLabel()
            FlowLayout { content() }
        }
    }
}

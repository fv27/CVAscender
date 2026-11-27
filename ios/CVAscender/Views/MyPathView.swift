import SwiftUI

/// My path — the website's tracker: progress, weekly goal, next deadlines,
/// and Saved / Applied / Completed lists.
struct MyPathView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @State private var tab: TrackStatus = .saved
    @State private var completing: Opportunity?
    @State private var cvLine = ""

    private var total: Int { store.tracks.count }
    private var done: Int { store.count(.completed) }
    private var applied: Int { store.count(.applied) }
    private var saved: Int { store.count(.saved) }
    private var appliedThisWeek: Bool {
        store.tracks.values.contains { $0.status != .saved && $0.updated > Date().addingTimeInterval(-7 * 86_400) }
    }
    private var upcoming: [PathItem] {
        (store.items(.saved) + store.items(.applied))
            .filter { ($0.o.daysLeft ?? -1) >= 0 }
            .sorted { ($0.o.daysLeft ?? 0) < ($1.o.daysLeft ?? 0) }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 8) {
                        Eyebrow(text: "Tracker")
                        Text("My path").display(54).foregroundStyle(Color.ink)
                    }
                    Spacer()
                    ThemeToggle()
                }
                progressCard
                deadlinesCard
                statusTabs
                list
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 110)
        }
        .background(Color.paper.ignoresSafeArea())
        .alert("Add it to your CV", isPresented: Binding(get: { completing != nil }, set: { if !$0 { completing = nil } })) {
            TextField("e.g. Led a team of 4", text: $cvLine)
            Button("Save") { if let o = completing { finish(o, cvLine.isEmpty ? nil : cvLine) } }
            Button("Skip", role: .cancel) { if let o = completing { finish(o, nil) } }
        } message: {
            Text("One line about what you did or achieved (optional).")
        }
    }

    private var progressCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Your progress").monoLabel()
            HStack(alignment: .firstTextBaseline, spacing: 10) {
                Text("\(done)").display(48).foregroundStyle(Color.ink)
                Text("done of \(total) on your path").font(.geist(14)).foregroundStyle(Color.inkSoft)
            }
            GeometryReader { geo in
                let w = geo.size.width
                let t = max(total, 1)
                HStack(spacing: 0) {
                    Rectangle().fill(Color.lapis).frame(width: w * CGFloat(done) / CGFloat(t))
                    Rectangle().fill(Color.pumpkin).frame(width: w * CGFloat(applied) / CGFloat(t))
                    Spacer(minLength: 0)
                }
                .background(Color.soft)
                .clipShape(Capsule())
            }
            .frame(height: 8)
            HStack(spacing: 14) {
                legend(Color.line, "Saved \(saved)")
                legend(Color.pumpkin, "Applied \(applied)")
                legend(Color.lapis, "Done \(done)")
            }
            HStack(spacing: 8) {
                Image(systemName: appliedThisWeek ? "checkmark" : "sun.max").font(.system(size: 13, weight: .semibold))
                Text(appliedThisWeek ? "Goal reached: you’ve applied to something this week. Keep going!" : "Goal: apply to one thing this week.")
                    .font(.geist(14, .medium))
            }
            .foregroundStyle(appliedThisWeek ? Color.okText : Color.ink)
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(appliedThisWeek ? Color.okSoft : Color.pumpkinSoft, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
        .cardStyle()
    }

    private func legend(_ color: Color, _ text: String) -> some View {
        HStack(spacing: 5) {
            Circle().fill(color).frame(width: 7, height: 7)
            Text(text).font(.geist(12)).foregroundStyle(Color.inkMuted)
        }
    }

    /// Calendar blocks for the next deadlines (website: "Next deadlines").
    private var deadlinesCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Next deadlines").monoLabel()
            if upcoming.isEmpty {
                Text("Save opportunities with a deadline and they’ll show up here.")
                    .font(.geist(14)).foregroundStyle(Color.inkSoft)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                    .padding(18)
                    .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(Color.line, style: StrokeStyle(lineWidth: 1.5, dash: [6, 5])))
            } else {
                ForEach(upcoming.prefix(3)) { item in
                    Button { router.open(item.o) } label: {
                        HStack(spacing: 12) {
                            if let d = item.o.deadlineDate {
                                VStack(spacing: 0) {
                                    Text(d.formatted(.dateTime.month(.abbreviated))).font(.mono(10)).textCase(.uppercase)
                                        .foregroundStyle(.white).frame(maxWidth: .infinity).padding(.vertical, 2).background(Color.pumpkin)
                                    Text(d.formatted(.dateTime.day())).font(.geist(20, .bold)).foregroundStyle(Color.ink)
                                        .frame(maxWidth: .infinity).padding(.vertical, 4)
                                }
                                .frame(width: 50)
                                .background(Color.card)
                                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                                .overlay(RoundedRectangle(cornerRadius: 10, style: .continuous).strokeBorder(Color.line))
                            }
                            VStack(alignment: .leading, spacing: 2) {
                                Text(item.o.title).font(.geist(15, .semibold)).foregroundStyle(Color.ink).lineLimit(2).multilineTextAlignment(.leading)
                                Text(item.o.deadlineLabel).font(.geist(13, .medium)).foregroundStyle(Color.pumpkin)
                            }
                            Spacer()
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .cardStyle()
    }

    /// Three big tiles: Saved / Applied / Completed (the selected one is lapis).
    private var statusTabs: some View {
        HStack(spacing: 8) {
            ForEach(TrackStatus.allCases) { s in
                let on = tab == s
                Button { withAnimation(.easeOut(duration: 0.2)) { tab = s } } label: {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(store.count(s))").display(30)
                        Text(s.label).font(.geist(13, .semibold))
                    }
                    .foregroundStyle(on ? Color.white : Color.ink)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(14)
                    .background(on ? Color.lapis : Color.card, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: 22, style: .continuous).strokeBorder(on ? Color.clear : Color.line))
                }
                .buttonStyle(.plain)
            }
        }
    }

    @ViewBuilder private var list: some View {
        let items = store.items(tab)
        if items.isEmpty {
            VStack(spacing: 14) {
                Text(tab == .saved ? "Bookmark opportunities from your feed and they’ll wait for you here."
                     : tab == .applied ? "Things you’ve applied to show up here." : "Finished something? Mark it Completed and it goes on your CV.")
                    .font(.geist(15)).foregroundStyle(Color.inkSoft).multilineTextAlignment(.center)
                Button("Back to the feed") { router.tab = .discover }.buttonStyle(.pill)
            }
            .padding(.vertical, 12)
            .cardStyle()
        } else {
            VStack(spacing: 10) {
                ForEach(items) { item in row(item) }
            }
        }
    }

    private func row(_ item: PathItem) -> some View {
        let o = item.o
        return HStack(spacing: 12) {
            Button { router.open(o) } label: {
                HStack(spacing: 12) {
                    ListingVisual(o: o, caption: false)
                        .frame(width: 64, height: 64)
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    VStack(alignment: .leading, spacing: 3) {
                        Text(o.title).font(.geist(15, .semibold)).foregroundStyle(Color.ink).lineLimit(2).multilineTextAlignment(.leading)
                        Text(o.deadlineLabel).font(.geist(12.5, .medium))
                            .foregroundStyle((o.daysLeft ?? 99) <= 14 && (o.daysLeft ?? -1) >= 0 ? Color.pumpkin : Color.inkMuted)
                            .lineLimit(1)
                        if let line = item.t.cvLine {
                            Text("“\(line)”").font(.geist(12.5)).foregroundStyle(Color.inkSoft).lineLimit(1)
                        }
                    }
                    Spacer(minLength: 0)
                }
            }
            .buttonStyle(.plain)
            Menu {
                if item.t.status != .applied { Button { move(o, .applied) } label: { Label("Applied", systemImage: TrackStatus.applied.symbol) } }
                if item.t.status != .completed { Button { cvLine = ""; completing = o } label: { Label("Completed", systemImage: TrackStatus.completed.symbol) } }
                if item.t.status != .saved { Button { move(o, .saved) } label: { Label("Back to saved", systemImage: TrackStatus.saved.symbol) } }
                Divider()
                Button(role: .destructive) { store.set(o.id, to: nil); router.notify("Removed") } label: { Label("Remove", systemImage: "trash") }
            } label: {
                Image(systemName: "ellipsis")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Color.inkMuted)
                    .frame(width: 36, height: 36)
                    .background(Color.soft, in: Circle())
            }
        }
        .padding(10)
        .background(Color.card, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 22, style: .continuous).strokeBorder(Color.line))
    }

    private func move(_ o: Opportunity, _ s: TrackStatus) {
        store.set(o.id, to: s)
        router.notify(s == .applied ? "Marked as applied" : "Moved to saved")
    }

    private func finish(_ o: Opportunity, _ line: String?) {
        store.set(o.id, to: .completed, cvLine: line.map { String($0.prefix(200)) })
        router.notify("Added to your CV 🎉")
    }
}

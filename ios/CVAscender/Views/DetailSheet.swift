import SwiftUI

/// Every detail of one listing (website's /o/[id] page and DetailSheet):
/// art, type labels, trust badge, big title, why it fits, facts, tracker,
/// reminders, and a sticky bar with Save and Apply.
struct DetailSheet: View {
    let o: Opportunity
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @Environment(\.openURL) private var openURL
    @Environment(\.dismiss) private var dismiss
    @State private var reminderOn = false
    @State private var askCVLine = false
    @State private var cvLine = ""
    @State private var alertText: String?

    private var match: Match? { store.profile.map { Matcher.match(o, $0, gaps: store.gaps) } }
    private var status: TrackStatus? { store.status(of: o.id) }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                ListingVisual(o: o, credit: true)
                    .frame(height: 230)
                    .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                VStack(alignment: .leading, spacing: 18) {
                    labels
                    VStack(alignment: .leading, spacing: 8) {
                        Text(o.title).display(34).foregroundStyle(Color.ink)
                        Text(o.org).font(.geist(16)).foregroundStyle(Color.inkMuted)
                    }
                    if let m = match { whyItFits(m) }
                    facts
                    tracker
                    textBlock("About", o.description)
                    if let d = o.details { textBlock("Details", d) }
                    if let e = o.eligibility { textBlock("Who can join", e) }
                    source
                }
                .padding(.horizontal, 20)
                .padding(.top, 18)
                .padding(.bottom, 120)
            }
        }
        .background(Color.paper.ignoresSafeArea())
        .overlay(alignment: .topTrailing) {
            Button { dismiss() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 34, height: 34)
                    .background(.black.opacity(0.35), in: Circle())
            }
            .padding(.top, 20).padding(.trailing, 28)
            .accessibilityLabel("Close")
        }
        .overlay(alignment: .bottom) { stickyBar }
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(32)
        .task { reminderOn = await Reminders.isScheduled(id: o.id) }
        .alert("Add it to your CV", isPresented: $askCVLine) {
            TextField("e.g. Reached the second round", text: $cvLine)
            Button("Save") { complete(cvLine.isEmpty ? nil : cvLine) }
            Button("Skip", role: .cancel) { complete(nil) }
        } message: {
            Text("One line about what you did or achieved (optional). It appears on your CV.")
        }
        .alert(alertText ?? "", isPresented: Binding(get: { alertText != nil }, set: { if !$0 { alertText = nil } })) {
            Button("OK", role: .cancel) {}
        }
    }

    // "ACADEMIC COMPETITION" outlined + "NATIONAL", then the trust badge
    private var labels: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                Text(o.type).font(.mono(10.5)).tracking(1).textCase(.uppercase).foregroundStyle(Color.ink)
                    .padding(.horizontal, 6).padding(.vertical, 3)
                    .overlay(RoundedRectangle(cornerRadius: 4).strokeBorder(Color.ink, lineWidth: 1))
                Text(o.scopeLabel).monoLabel(10.5)
            }
            TrustBadge(verified: o.verified)
        }
    }

    private func whyItFits(_ m: Match) -> some View {
        HStack(alignment: .top, spacing: 14) {
            MatchRing(score: m.score, size: 52)
            VStack(alignment: .leading, spacing: 6) {
                Text("Why it fits you").font(.geist(15, .semibold)).foregroundStyle(Color.ink)
                Text(m.explanation).font(.geist(14)).foregroundStyle(Color.inkSoft)
                ForEach(m.warnings, id: \.self) { w in
                    Label(w, systemImage: "exclamationmark.circle").font(.geist(13)).foregroundStyle(Color.warnText)
                }
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.lapisSoft, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private var facts: some View {
        VStack(spacing: 0) {
            fact("calendar", "When", o.deadlineLabel)
            if let t = o.timing, o.deadline != nil {
                divider
                fact("clock", "Usually", t)
            }
            divider
            fact("mappin.and.ellipse", "Where", o.locationLabel)
            if let c = o.commitment {
                divider
                fact("hourglass", "Time", c)
            }
            if let c = o.cost {
                divider
                fact("creditcard", "Cost", c)
            }
            if let min = o.minAge {
                divider
                fact("person", "Ages", o.maxAge.map { "\(min)–\($0)" } ?? "From \(min)")
            }
            if let s = o.cvSection {
                divider
                fact("doc.text", "On your CV", s)
            }
        }
        .background(Color.card, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 22, style: .continuous).strokeBorder(Color.line))
    }

    private var divider: some View { Rectangle().fill(Color.line).frame(height: 1).padding(.leading, 48) }

    private func fact(_ icon: String, _ label: String, _ value: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon).font(.system(size: 15)).foregroundStyle(Color.lapis).frame(width: 22)
            Text(label).monoLabel(10.5).frame(width: 78, alignment: .leading).padding(.top, 2)
            Text(value).font(.geist(14.5)).foregroundStyle(Color.ink).frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
    }

    /// Saved → Applied → Completed, plus the reminder bell.
    private var tracker: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Your path").monoLabel()
            HStack(spacing: 8) {
                ForEach(TrackStatus.allCases) { s in
                    let on = status == s
                    Button { choose(s) } label: {
                        VStack(spacing: 4) {
                            Image(systemName: s.symbol).font(.system(size: 15, weight: .semibold))
                            Text(s.label).font(.geist(12, .semibold))
                        }
                        .foregroundStyle(on ? Color.white : Color.inkSoft)
                        .frame(maxWidth: .infinity, minHeight: 58)
                        .background(on ? Color.lapis : Color.soft, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
                Button { Task { await toggleReminder() } } label: {
                    VStack(spacing: 4) {
                        Image(systemName: reminderOn ? "bell.fill" : "bell").font(.system(size: 15, weight: .semibold))
                        Text("Remind").font(.geist(12, .semibold))
                    }
                    .foregroundStyle(reminderOn ? Color.white : Color.inkSoft)
                    .frame(maxWidth: .infinity, minHeight: 58)
                    .background(reminderOn ? Color.pumpkin : Color.soft, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
                .buttonStyle(.plain)
            }
            if status != nil {
                Button("Remove from My path", role: .destructive) { store.set(o.id, to: nil); router.notify("Removed") }
                    .font(.geist(13, .medium))
            }
        }
        .sensoryFeedback(.success, trigger: status)
    }

    private func textBlock(_ title: String, _ text: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title).font(.geist(19, .bold)).tracking(-0.4).foregroundStyle(Color.ink)
            Text(text).font(.geist(15.5)).foregroundStyle(Color.inkSoft).lineSpacing(3)
        }
    }

    private var source: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let s = o.source { Text("Source: \(s)").font(.geist(12.5)).foregroundStyle(Color.inkMuted) }
            Text(o.verified
                 ? "Checked against the official source. Dates change every year — confirm on the official site."
                 : "Not checked yet: a real organisation, but confirm ages, dates and costs on the official site before you apply.")
                .font(.geist(12.5)).foregroundStyle(Color.inkMuted)
            Link(destination: SubscriptionStore.mailURL(subject: "Listing: \(o.title) (\(o.id))")) {
                Label("Spot a mistake? Tell us", systemImage: "envelope")
            }
            .font(.geist(12.5, .semibold))
            .foregroundStyle(Color.lapis)
        }
    }

    /// Website's sticky bar: timing + title, round Save, orange Apply.
    private var stickyBar: some View {
        HStack(spacing: 10) {
            VStack(alignment: .leading, spacing: 2) {
                Text(o.deadlineLabel).monoLabel(10).lineLimit(1)
                Text(o.title).font(.geist(14, .semibold)).foregroundStyle(Color.ink).lineLimit(1)
            }
            Spacer(minLength: 4)
            Button {
                store.toggleSaved(o.id)
                router.notify(store.isSaved(o.id) ? "Saved to My path" : "Removed")
            } label: {
                Image(systemName: store.isSaved(o.id) ? "bookmark.fill" : "bookmark")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 46, height: 46)
                    .background(Color.lapis, in: Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(store.isSaved(o.id) ? "Saved" : "Save")
            if let url = o.linkURL {
                Button {
                    openURL(url)
                    if status == nil || status == .saved {
                        alertText = "Did you apply? Mark it as Applied under “Your path” so it shows on My path."
                    }
                } label: {
                    Text(o.linkIsSearch == true ? "Find it" : "Apply")
                }
                .buttonStyle(.pill(.signal, height: 46))
            }
        }
        .padding(.leading, 20)
        .padding(.trailing, 8)
        .padding(.vertical, 8)
        .background(.regularMaterial, in: Capsule())
        .overlay(Capsule().strokeBorder(Color.line))
        .shadow(color: .black.opacity(0.12), radius: 16, y: 6)
        .padding(.horizontal, 14)
        .padding(.bottom, 10)
    }

    private func choose(_ s: TrackStatus) {
        if s == .completed {
            cvLine = store.tracks[o.id]?.cvLine ?? ""
            askCVLine = true
        } else {
            store.set(o.id, to: s)
            router.notify(s == .applied ? "Marked as applied" : "Saved to My path")
        }
    }

    private func complete(_ line: String?) {
        store.set(o.id, to: .completed, cvLine: line.map { String($0.prefix(200)) })
        router.notify("Added to your CV 🎉")
    }

    private func toggleReminder() async {
        if reminderOn {
            Reminders.cancel(id: o.id)
            reminderOn = false
            router.notify("Reminder cancelled")
            return
        }
        let hasDeadline = o.deadlineDate.map { $0 > Date() } ?? false
        let ok: Bool
        if hasDeadline {
            ok = await Reminders.scheduleDeadline(for: o)
        } else {
            ok = await Reminders.scheduleNudge(for: o)
        }
        if ok {
            reminderOn = true
            if status == nil { store.set(o.id, to: .saved) }
            router.notify(hasDeadline ? "We’ll remind you 3 days before" : "We’ll remind you in a week")
        } else {
            alertText = "Notifications are off. Turn them on in Settings → Notifications → CVAscender."
        }
    }
}

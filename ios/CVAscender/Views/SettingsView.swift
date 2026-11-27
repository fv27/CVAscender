import SwiftUI
import UIKit
import StoreKit

/// Settings — the website's page: device-data card, your answers, appearance, subscription, notifications, about.
struct SettingsView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @EnvironmentObject private var subs: SubscriptionStore
    @AppStorage("cva.theme") private var theme = ThemeMode.system.rawValue
    @State private var confirmReset = false
    @State private var manageSubscription = false
    private let cat = Catalog.shared

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 8) {
                        Eyebrow(text: "Settings")
                        Text("Settings").display(54).foregroundStyle(Color.ink)
                    }
                    Spacer()
                    ThemeToggle()
                }
                Text("Change the answers you gave when you started, and choose how the app looks.")
                    .font(.geist(15)).foregroundStyle(Color.inkSoft)
                deviceCard
                contact
                answers
                appearance
                if SubscriptionStore.paywallEnabled { subscription }
                notifications
                dataCard
                about
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 110)
        }
        .background(Color.paper.ignoresSafeArea())
        .manageSubscriptionsSheet(isPresented: $manageSubscription)
        .confirmationDialog("Delete everything and start again?", isPresented: $confirmReset, titleVisibility: .visible) {
            Button("Yes, start again from scratch", role: .destructive) { store.resetAll() }
        }
    }

    private var deviceCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Your data").font(.mono(11)).tracking(1.3).textCase(.uppercase).foregroundStyle(Color(UIColor(hex: 0xFF7518)))
            Text("Stays on this iPhone").display(28).foregroundStyle(.white)
            HStack(spacing: 6) {
                Image(systemName: "checkmark").font(.system(size: 12, weight: .bold))
                Text("No account, no tracking, no ads. Your answers, My path and CV are saved only here, encrypted by iOS.")
            }
            .font(.geist(14)).foregroundStyle(.white.opacity(0.8))
        }
        .padding(22)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor(hex: 0x183E69)), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(alignment: .bottom) {
            UnevenRoundedRectangle(bottomLeadingRadius: 28, bottomTrailingRadius: 28, style: .continuous)
                .fill(Color(UIColor(hex: 0xFF7518))).frame(height: 4)
        }
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
    }

    private var answers: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Your answers").display(26).foregroundStyle(Color.ink)
                Spacer()
                Button("Edit all") { router.editStep = 0 }.font(.geist(14, .semibold)).foregroundStyle(Color.pumpkin)
            }
            .padding(.horizontal, 20).padding(.top, 18).padding(.bottom, 8)
            if let p = store.profile {
                row("Where you live", "\(p.city), \(cat.cantonName(p.canton)), \(cat.country(p.country).name)", step: 0)
                row("About you", [p.name, "age \(p.age)", cat.yearLabel(p.year, country: p.country)].filter { !$0.isEmpty }.joined(separator: " · "), step: 1)
                row("Interests", p.interests.map { cat.interestLabel($0) }.joined(separator: ", "), step: 2)
                row("Skills to build", p.skills.joined(separator: ", "), step: 3)
            }
        }
        .background(Color.card, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 28, style: .continuous).strokeBorder(Color.line))
    }

    private func row(_ label: String, _ value: String, step: Int) -> some View {
        Button { router.editStep = step } label: {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(label).font(.geist(11.5, .semibold)).textCase(.uppercase).tracking(0.6).foregroundStyle(Color.inkMuted)
                    Text(value.isEmpty ? "—" : value).font(.geist(15)).foregroundStyle(Color.ink).lineLimit(1)
                }
                Spacer()
                HStack(spacing: 4) { Text("Edit"); Image(systemName: "arrow.right").font(.system(size: 12, weight: .semibold)) }
                    .font(.geist(14, .semibold)).foregroundStyle(Color.lapis)
            }
            .padding(.horizontal, 20).padding(.vertical, 14)
            .overlay(alignment: .top) { Rectangle().fill(Color.line).frame(height: 1) }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private var appearance: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Appearance").display(26).foregroundStyle(Color.ink)
            HStack(spacing: 8) {
                ForEach(ThemeMode.allCases) { m in
                    let on = theme == m.rawValue
                    Button { theme = m.rawValue } label: {
                        VStack(spacing: 8) {
                            Image(systemName: m == .system ? "circle.lefthalf.filled" : m == .light ? "sun.max" : "moon")
                                .font(.system(size: 20, weight: .medium))
                            Text(m.label).font(.geist(13, .semibold))
                        }
                        .foregroundStyle(on ? Color.white : Color.ink)
                        .frame(maxWidth: .infinity, minHeight: 74)
                        .background(on ? Color.lapis : Color.soft, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .cardStyle()
    }

    private var subscription: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Subscription").display(26).foregroundStyle(Color.ink)
            Text(subs.isSubscribed ? "CVAscender Plus is active. You can change plan or cancel anytime." : "No active subscription.")
                .font(.geist(14)).foregroundStyle(Color.inkSoft)
            HStack(spacing: 8) {
                Button("Manage subscription") { manageSubscription = true }.buttonStyle(.pill(.ghost, height: 42))
                Button("Restore purchases") { Task { await subs.restore() } }.buttonStyle(.pill(.ghost, height: 42))
            }
        }
        .cardStyle()
    }

    private var notifications: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Reminders").display(26).foregroundStyle(Color.ink)
            Text("Tap the bell on any listing to get a reminder 3 days before its deadline, or a nudge a week later.")
                .font(.geist(14)).foregroundStyle(Color.inkSoft)
            Button("Notification settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
            }
            .buttonStyle(.pill(.ghost, height: 42))
        }
        .cardStyle()
    }

    private var dataCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Data on this device").display(26).foregroundStyle(Color.ink)
            Text("Your profile and progress are stored only on this iPhone. Deleting the app deletes them too.")
                .font(.geist(14)).foregroundStyle(Color.inkSoft)
            Button("Reset everything and start again") { confirmReset = true }.buttonStyle(.pill(.ghost, height: 42))
        }
        .cardStyle()
    }

    /// Contact card: questions, mistakes in listings, missing opportunities.
    private var contact: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Contact").display(26).foregroundStyle(Color.ink)
            Text("Questions, a mistake in a listing, or an opportunity we’re missing? Write to us.")
                .font(.geist(14)).foregroundStyle(Color.inkSoft)
            Link(destination: SubscriptionStore.mailURL()) {
                Label(SubscriptionStore.contactEmail, systemImage: "envelope")
            }
            .buttonStyle(.pill(.ghost, height: 42))
        }
        .cardStyle()
    }

    private var about: some View {
        VStack(alignment: .leading, spacing: 10) {
            Logo(size: 20)
            Text("\(cat.opportunities.count) opportunities for high-school students in Switzerland. “Real · source checked” listings were verified against official pages; “Not checked yet” listings are real organisations whose details you should confirm on their website. Dates change every year — always check the official site.")
                .font(.geist(13)).foregroundStyle(Color.inkMuted)
            Text("Photos are illustrative (Unsplash). Club and organiser logos belong to their owners. CVAscender isn’t affiliated with the organisations listed and never recommends a bank.")
                .font(.geist(13)).foregroundStyle(Color.inkMuted)
            HStack(spacing: 16) {
                Link("Terms of Use", destination: SubscriptionStore.termsURL)
                Link("Privacy", destination: SubscriptionStore.privacyURL)
                Link(SubscriptionStore.contactEmail, destination: SubscriptionStore.mailURL())
            }
            .font(.geist(13, .semibold))
            Text("Data version \(cat.file.generated) · Font: Geist (SIL Open Font License)")
                .font(.geist(11.5)).foregroundStyle(Color.inkMuted.opacity(0.8))
        }
        .padding(.horizontal, 4)
        .padding(.top, 6)
    }
}

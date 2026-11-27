import SwiftUI
import StoreKit

/// Paywall shown after onboarding and whenever there's no active subscription.
/// Structure from Mobbin: 5 Minute Journal (how the free trial works) + Cal AI / Bevel (plan picker),
/// in CVAscender's own look (Geist, lapis and pumpkin).
struct PaywallView: View {
    @EnvironmentObject private var subs: SubscriptionStore
    @State private var selected: String?

    private var yearly: Product? { subs.products.first { $0.id == "cvascender.plus.yearly" } }
    private var monthly: Product? { subs.products.first { $0.id == "cvascender.plus.monthly" } }
    private var chosen: Product? { subs.products.first { $0.id == selected } ?? yearly ?? subs.products.first }
    private var hasTrial: Bool { subs.trialEligible && chosen?.subscription?.introductoryOffer?.paymentMode == .freeTrial }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                HStack { Logo(size: 22); Spacer(); ThemeToggle() }
                VStack(alignment: .leading, spacing: 12) {
                    Eyebrow(text: "CVAscender Plus")
                    (Text(subs.trialEligible ? "Try it " : "Keep ").foregroundColor(.ink)
                     + Text(subs.trialEligible ? "free" : "ascending").foregroundColor(.pumpkin)
                     + Text(subs.trialEligible ? " for 7 days." : ".").foregroundColor(.ink))
                        .display(44)
                    Text("Every olympiad, competition, club, camp and volunteering role in Switzerland — matched to you, with a CV that builds itself.")
                        .font(.geist(16)).foregroundStyle(Color.inkSoft)
                }
                if subs.trialEligible { timeline }
                plans
                if let e = subs.errorText {
                    Text(e).font(.geist(13)).foregroundStyle(.red)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 16)
        }
        .background(Color.paper.ignoresSafeArea())
        .safeAreaInset(edge: .bottom) { bottom }
        .task { if subs.products.isEmpty { await subs.loadProducts() } }
    }

    /// Today → Day 5 → Day 7 (5 Minute Journal pattern).
    private var timeline: some View {
        VStack(alignment: .leading, spacing: 0) {
            step("lock.open.fill", "Today", "Full access: the feed, Explore, saving, reminders and your CV.", last: false)
            step("bell.fill", "Day 5", "We remind you that your trial is ending (if notifications are on).", last: false)
            step("checkmark.seal.fill", "Day 7", "Your subscription starts. Cancel anytime before and you won’t be charged.", last: true)
        }
        .cardStyle()
    }

    private func step(_ icon: String, _ title: String, _ text: String, last: Bool) -> some View {
        HStack(alignment: .top, spacing: 14) {
            VStack(spacing: 0) {
                Image(systemName: icon)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 36, height: 36)
                    .background(last ? Color.pumpkin : Color.lapis, in: Circle())
                if !last { Rectangle().fill(Color.line).frame(width: 2).frame(maxHeight: .infinity) }
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(.geist(16, .semibold)).foregroundStyle(Color.ink)
                Text(text).font(.geist(14)).foregroundStyle(Color.inkSoft)
            }
            .padding(.bottom, last ? 0 : 18)
        }
        .fixedSize(horizontal: false, vertical: true)
    }

    private var plans: some View {
        VStack(spacing: 10) {
            if subs.products.isEmpty {
                VStack(spacing: 12) {
                    if subs.loading {
                        HStack(spacing: 10) {
                            ProgressView()
                            Text("Loading plans…").font(.geist(15)).foregroundStyle(Color.inkMuted)
                        }
                    } else {
                        Button("Try again") { Task { await subs.loadProducts() } }
                            .buttonStyle(.pill(.ghost, height: 44))
                    }
                }
                .frame(maxWidth: .infinity, minHeight: 120)
            }
            if let y = yearly { planRow(y, title: "Yearly", detail: yearlyDetail(y), badge: savingText) }
            if let m = monthly { planRow(m, title: "Monthly", detail: "\(m.displayPrice) per month", badge: nil) }
        }
    }

    private func planRow(_ p: Product, title: String, detail: String, badge: String?) -> some View {
        let on = chosen?.id == p.id
        return Button { selected = p.id } label: {
            HStack(spacing: 14) {
                Image(systemName: on ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 24))
                    .foregroundStyle(on ? Color.lapis : Color.line)
                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 8) {
                        Text(title).font(.geist(17, .semibold)).foregroundStyle(Color.ink)
                        if let badge {
                            Text(badge).font(.geist(11, .bold))
                                .padding(.horizontal, 8).padding(.vertical, 3)
                                .foregroundStyle(.white)
                                .background(Color.pumpkin, in: Capsule())
                        }
                    }
                    Text(detail).font(.geist(14)).foregroundStyle(Color.inkMuted)
                }
                Spacer()
                Text(p.displayPrice).font(.geist(17, .bold)).foregroundStyle(Color.ink)
            }
            .padding(18)
            .background(Color.card, in: RoundedRectangle(cornerRadius: 22, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 22, style: .continuous).strokeBorder(on ? Color.lapis : Color.line, lineWidth: on ? 2 : 1))
        }
        .buttonStyle(.plain)
    }

    private func yearlyDetail(_ y: Product) -> String {
        "\((y.price / 12).formatted(y.priceFormatStyle)) per month, billed yearly"
    }

    /// "Save 17%" compared with paying monthly for a year.
    private var savingText: String? {
        guard let y = yearly, let m = monthly, m.price > 0 else { return nil }
        let yearOfMonthly = NSDecimalNumber(decimal: m.price * 12).doubleValue
        let yearlyPrice = NSDecimalNumber(decimal: y.price).doubleValue
        guard yearOfMonthly > yearlyPrice else { return nil }
        return "Save \(Int(((1 - yearlyPrice / yearOfMonthly) * 100).rounded()))%"
    }

    private var bottom: some View {
        VStack(spacing: 10) {
            Button {
                if let p = chosen { Task { await subs.buy(p) } }
            } label: {
                Group {
                    if subs.purchasing { ProgressView().tint(.white) }
                    else { Text(hasTrial ? "Start 7-day free trial" : "Subscribe") }
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.pill(.signal, height: 54))
            .disabled(chosen == nil || subs.purchasing)
            .opacity(chosen == nil ? 0.5 : 1)

            Text(fineprint).font(.geist(11)).foregroundStyle(Color.inkMuted).multilineTextAlignment(.center)

            HStack(spacing: 18) {
                Link("Terms of Use", destination: SubscriptionStore.termsURL)
                Link("Privacy", destination: SubscriptionStore.privacyURL)
                Button("Restore") { Task { await subs.restore() } }
                Link("Help", destination: SubscriptionStore.mailURL(subject: "CVAscender subscription"))
            }
            .font(.geist(13, .semibold))
            .foregroundStyle(Color.lapis)

            if DebugUnlock.isDebugBuild {
                // Lets you test the app in Xcode without buying. Hidden in App Store builds.
                Button("Skip (debug builds only)") { DebugUnlock.shared.unlocked = true }
                    .font(.geist(11)).foregroundStyle(Color.inkMuted)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(.bar)
    }

    /// Required subscription information (App Review Guideline 3.1.2).
    private var fineprint: String {
        guard let p = chosen else { return "" }
        let period = p.id == "cvascender.plus.yearly" ? "year" : "month"
        let start = hasTrial ? "7 days free, then \(p.displayPrice) per \(period)." : "\(p.displayPrice) per \(period)."
        return start + " Renews automatically unless cancelled at least 24 hours before the end of the current period. Payment is charged to your Apple ID. Cancel anytime in Settings → Apple ID → Subscriptions."
    }
}

/// Switch to get past the paywall in the Simulator — only honoured in debug builds.
@MainActor
final class DebugUnlock: ObservableObject {
    static let shared = DebugUnlock()
    @Published var unlocked = false
    static let isDebugBuild: Bool = {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }()
}

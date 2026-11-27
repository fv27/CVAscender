import Foundation
import StoreKit

/// CVAscender Plus — the subscription that unlocks the app (StoreKit 2).
/// Prices are set in App Store Connect (CHF 1.50/month, CHF 15/year, both with a
/// 7-day free trial); the app shows whatever Apple returns, in the user's currency.
@MainActor
final class SubscriptionStore: ObservableObject {
    /// ON/OFF switch for the subscription. `false` = the app is completely free (version 1.0).
    /// To start charging later: create the subscriptions in App Store Connect, set this to `true`,
    /// and submit an update.
    static let paywallEnabled = false

    /// Must match the product IDs you create in App Store Connect.
    static let productIDs = ["cvascender.plus.yearly", "cvascender.plus.monthly"]
    /// Contact address shown in Settings, listings and the paywall.
    static let contactEmail = "cvascender@gmail.com"
    static func mailURL(subject: String = "CVAscender") -> URL {
        let s = subject.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "CVAscender"
        return URL(string: "mailto:\(contactEmail)?subject=\(s)")!
    }
    /// Apple's standard Terms of Use (EULA).
    static let termsURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!
    /// ⚠️ Change to your deployed website's privacy page before submitting.
    static let privacyURL = URL(string: "https://cvascender.vercel.app/privacy")!

    @Published private(set) var products: [Product] = []
    @Published private(set) var isSubscribed = false
    @Published private(set) var checked = false          // first entitlement check finished
    @Published private(set) var trialEligible = true
    @Published private(set) var purchasing = false
    @Published private(set) var loading = false
    @Published var errorText: String?

    private var updatesTask: Task<Void, Never>?

    init() {
        // Purchases made elsewhere (renewals, Ask to Buy approvals, other devices).
        updatesTask = Task { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let t) = result { await t.finish() }
                await self?.refresh()
            }
        }
        guard Self.paywallEnabled else { checked = true; return }   // free app: no StoreKit calls
        Task { await refresh(); await loadProducts() }
    }

    func loadProducts() async {
        loading = true
        errorText = nil
        defer { loading = false }
        do {
            let list = try await Product.products(for: Self.productIDs)
            products = list.sorted { $0.price > $1.price }   // yearly first
            if let info = list.first?.subscription { trialEligible = await info.isEligibleForIntroOffer }
            if list.isEmpty { errorText = Self.notFoundMessage }
        } catch {
            errorText = DebugUnlock.isDebugBuild
                ? "StoreKit error: \(error.localizedDescription)"
                : "Couldn’t load the plans. Check your internet connection and try again."
        }
    }

    /// In Xcode test builds, say exactly what's wrong; in the App Store build, keep it simple.
    private static var notFoundMessage: String {
        DebugUnlock.isDebugBuild
            ? "TEST BUILD: Apple returned no plans. In Xcode choose Product → Scheme → Edit Scheme → Run → Options → StoreKit Configuration and select your .storekit file (with products cvascender.plus.yearly and cvascender.plus.monthly), then stop and run again."
            : "Couldn’t load the plans. Check your internet connection and try again."
    }

    /// Is there an active subscription (including a free trial)?
    /// Security: the answer comes only from Apple — StoreKit 2 transactions are signed by
    /// Apple (JWS) and `.verified` means the signature checked out on this device. Nothing
    /// is cached by the app, so editing local files can't unlock it; it's re-checked at
    /// every launch and whenever the app comes back to the front.
    func refresh() async {
        var active = false
        for await result in Transaction.currentEntitlements {
            guard case .verified(let t) = result,                 // signed by Apple
                  Self.productIDs.contains(t.productID),          // one of OUR products
                  t.productType == .autoRenewable,
                  t.revocationDate == nil,                        // not refunded / revoked
                  !t.isUpgraded else { continue }                 // superseded by another plan
            if let end = t.expirationDate, end > Date() { active = true }
        }
        isSubscribed = active
        checked = true
    }

    func buy(_ product: Product) async {
        purchasing = true
        defer { purchasing = false }
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                guard case .verified(let t) = verification, Self.productIDs.contains(t.productID) else {
                    errorText = "Couldn’t verify the purchase."
                    return
                }
                await t.finish()
                // Free trial started: remind the student 2 days before it ends.
                if t.offerType == .introductory, let end = t.expirationDate {
                    await Reminders.scheduleTrialEnding(at: end)
                }
                await refresh()
            case .pending:
                errorText = "Waiting for approval — for example a parent approving with Ask to Buy."
            case .userCancelled:
                break
            @unknown default:
                break
            }
        } catch {
            errorText = error.localizedDescription
        }
    }

    func restore() async {
        do { try await AppStore.sync() } catch { errorText = error.localizedDescription }
        await refresh()
        if !isSubscribed && errorText == nil { errorText = "No active subscription found for this Apple ID." }
    }
}

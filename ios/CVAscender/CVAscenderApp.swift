import SwiftUI

@main
struct CVAscenderApp: App {
    @StateObject private var store = StudentStore()
    @StateObject private var router = Router()
    @StateObject private var subs = SubscriptionStore()
    @AppStorage("cva.theme") private var theme = ThemeMode.system.rawValue
    @Environment(\.scenePhase) private var phase

    init() {
        // Keep downloaded photos and logos around (50 MB memory, 200 MB disk).
        URLCache.shared = URLCache(memoryCapacity: 50 << 20, diskCapacity: 200 << 20)
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .environmentObject(router)
                .environmentObject(subs)
                .tint(Color.lapis)
                .preferredColorScheme((ThemeMode(rawValue: theme) ?? .system).scheme)
        }
        // Re-check the subscription every time the app comes back to the front
        // (a cancelled or expired subscription locks the app again).
        .onChange(of: phase) { if phase == .active && SubscriptionStore.paywallEnabled { Task { await subs.refresh() } } }
    }
}

enum AppTab: String, CaseIterable, Identifiable {
    case discover, explore, path, profile, settings
    var id: String { rawValue }
    var label: String {
        switch self {
        case .discover: return "Discover"
        case .explore: return "Explore"
        case .path: return "My path"
        case .profile: return "Profile"
        case .settings: return "Settings"
        }
    }
    var icon: String {
        switch self {
        case .discover: return "house"
        case .explore: return "magnifyingglass"
        case .path: return "bookmark"
        case .profile: return "person"
        case .settings: return "gearshape"
        }
    }
    var filledIcon: String {
        switch self {
        case .explore, .settings: return icon
        default: return icon + ".fill"
        }
    }
}

/// App-wide navigation: the current tab, the open details sheet and toasts.
@MainActor
final class Router: ObservableObject {
    @Published var tab: AppTab = .discover
    @Published var detail: Opportunity?
    @Published var toast: String?
    @Published var editStep: Int?          // opens onboarding at this step to change answers
    private var toastTask: Task<Void, Never>?

    func open(_ o: Opportunity) { detail = o }

    func notify(_ text: String) {
        toastTask?.cancel()
        withAnimation(.spring(duration: 0.3)) { toast = text }
        toastTask = Task {
            try? await Task.sleep(nanoseconds: 1_800_000_000)
            if !Task.isCancelled { withAnimation(.easeOut(duration: 0.25)) { self.toast = nil } }
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @EnvironmentObject private var subs: SubscriptionStore
    @ObservedObject private var debug = DebugUnlock.shared

    /// The whole app needs an active subscription (or free trial).
    /// (The debug skip only works in Xcode debug builds, never in App Store builds.)
    private var unlocked: Bool { !SubscriptionStore.paywallEnabled || subs.isSubscribed || (DebugUnlock.isDebugBuild && debug.unlocked) }

    var body: some View {
        Group {
            if store.profile == nil {
                OnboardingView(initial: Profile(), editing: false, startStep: 0) { store.profile = $0 }
            } else if !subs.checked {
                ZStack { Color.paper.ignoresSafeArea(); ProgressView() }
            } else if !unlocked {
                PaywallView()
            } else {
                MainView()
            }
        }
        .overlay(alignment: .top) {
            if let toast = router.toast {
                ToastView(text: toast)
                    .padding(.top, 8)
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
    }
}

/// The five screens with the floating capsule tab bar on top (website + Waymo/Apple Games pattern).
struct MainView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router

    var body: some View {
        TabView(selection: $router.tab) {
            FeedView().tag(AppTab.discover).toolbar(.hidden, for: .tabBar)
            ExploreView().tag(AppTab.explore).toolbar(.hidden, for: .tabBar)
            MyPathView().tag(AppTab.path).toolbar(.hidden, for: .tabBar)
            ProfileView().tag(AppTab.profile).toolbar(.hidden, for: .tabBar)
            SettingsView().tag(AppTab.settings).toolbar(.hidden, for: .tabBar)
        }
        .overlay(alignment: .bottom) { FloatingTabBar() }
        .sheet(item: $router.detail) { o in
            DetailSheet(o: o)
                .environmentObject(store)
                .environmentObject(router)
        }
        .fullScreenCover(isPresented: Binding(get: { router.editStep != nil }, set: { if !$0 { router.editStep = nil } })) {
            if let p = store.profile {
                OnboardingView(initial: p, editing: true, startStep: router.editStep ?? 0) { updated in
                    store.profile = updated
                    router.editStep = nil
                    router.notify("Saved")
                } onCancel: {
                    router.editStep = nil
                }
            }
        }
    }
}

struct FloatingTabBar: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @Namespace private var pill

    private var pathBadge: Bool { store.tracks.values.contains { $0.status != .completed } }

    var body: some View {
        HStack(spacing: 4) {
            ForEach(AppTab.allCases) { tab in
                let on = router.tab == tab
                Button {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) { router.tab = tab }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: on ? tab.filledIcon : tab.icon)
                            .font(.system(size: 18, weight: on ? .semibold : .regular))
                        if on {
                            Text(tab.label.split(separator: " ").first.map { String($0) } ?? tab.label)
                                .font(.geist(13, .semibold))
                                .fixedSize()
                        }
                    }
                    .foregroundStyle(on ? Color.white : Color.inkMuted)
                    .padding(.horizontal, on ? 16 : 0)
                    .frame(minWidth: 44, minHeight: 44)
                    .background {
                        if on { Capsule().fill(Color.lapis).matchedGeometryEffect(id: "pill", in: pill) }
                    }
                    .overlay(alignment: .topTrailing) {
                        if tab == .path && pathBadge && !on {
                            Circle().fill(Color.pumpkin).frame(width: 8, height: 8).offset(x: -8, y: 8)
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(tab.label)
                .accessibilityAddTraits(on ? .isSelected : [])
            }
        }
        .padding(6)
        .background(.regularMaterial, in: Capsule())
        .overlay(Capsule().strokeBorder(Color.line.opacity(0.8)))
        .shadow(color: Color.black.opacity(0.12), radius: 20, y: 8)
        .padding(.bottom, 4)
        .sensoryFeedback(.selection, trigger: router.tab)
    }
}

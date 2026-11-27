import SwiftUI
import UIKit

// MARK: - Colours (the website's CSS variables from app/globals.css, light and dark)

extension UIColor {
    convenience init(hex: UInt32, alpha: CGFloat = 1) {
        self.init(red: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255,
                  blue: CGFloat(hex & 0xFF) / 255, alpha: alpha)
    }
}

extension Color {
    /// A colour that switches with light/dark mode.
    static func dynamic(_ light: UInt32, _ dark: UInt32) -> Color {
        Color(UIColor { $0.userInterfaceStyle == .dark ? UIColor(hex: dark) : UIColor(hex: light) })
    }

    static let paper = dynamic(0xFFFFFF, 0x090E1A)
    static let soft = dynamic(0xF3F6FB, 0x141C2E)
    static let card = dynamic(0xFFFFFF, 0x0F1626)
    static let ink = dynamic(0x101828, 0xECF0F7)
    static let inkSoft = dynamic(0x344054, 0xC4CCDA)
    static let inkMuted = dynamic(0x667085, 0x8C97AC)
    static let line = dynamic(0xE2E7F0, 0x242F46)
    static let lapis = dynamic(0x26619C, 0x5891D2)
    static let lapisDeep = dynamic(0x183E69, 0x16345C)
    static let lapisSoft = dynamic(0xE6EFF8, 0x192A46)
    static let pumpkin = dynamic(0xFF7518, 0xFF802E)
    static let pumpkinSoft = dynamic(0xFFEEE0, 0x3E2412)
    static let okText = dynamic(0x047857, 0x34D399)
    static let okSoft = dynamic(0xECFDF5, 0x0F2E25)
    static let warnText = dynamic(0x92400E, 0xFBBF24)
    static let warnSoft = dynamic(0xFFFBEB, 0x33270C)

    init(hex: String) {
        var value: UInt64 = 0
        Scanner(string: hex.replacingOccurrences(of: "#", with: "")).scanHexInt64(&value)
        self.init(red: Double((value >> 16) & 0xFF) / 255, green: Double((value >> 8) & 0xFF) / 255, blue: Double(value & 0xFF) / 255)
    }

    /// Category colour (the website's interest colours).
    static func hue(_ interestId: String?) -> Color {
        guard let id = interestId, let i = Catalog.shared.interest(id) else { return Color(hex: "#15140F") }
        return Color(hex: i.hue)
    }
}

// MARK: - Light / dark mode

enum ThemeMode: String, CaseIterable, Identifiable {
    case system, light, dark
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
    var scheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}

/// The round sun/moon button in the top-right corner, like the website's.
struct ThemeToggle: View {
    @AppStorage("cva.theme") private var theme = ThemeMode.system.rawValue
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        Button {
            theme = (scheme == .dark ? ThemeMode.light : ThemeMode.dark).rawValue
        } label: {
            Image(systemName: scheme == .dark ? "sun.max" : "moon")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(Color.ink)
                .frame(width: 40, height: 40)
                .background(Color.card, in: Circle())
                .overlay(Circle().strokeBorder(Color.line))
                .shadow(color: .black.opacity(0.06), radius: 6, y: 2)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(scheme == .dark ? "Switch to light mode" : "Switch to dark mode")
    }
}

// MARK: - Type (Geist, bundled from the website's font)

extension Font {
    static func geist(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font {
        let name: String
        switch weight {
        case .bold, .heavy, .black: name = "Geist-Bold"
        case .semibold: name = "Geist-SemiBold"
        case .medium: name = "Geist-Medium"
        default: name = "Geist-Regular"
        }
        return .custom(name, size: size)
    }
    static func mono(_ size: CGFloat) -> Font { .custom("GeistMono-Medium", size: size) }
}

extension View {
    /// Big bold heading with tight letter-spacing (the website's `font-display`).
    func display(_ size: CGFloat) -> some View {
        font(.geist(size, .bold)).tracking(-size * 0.035).lineSpacing(-size * 0.08)
    }
    /// Typewriter-style uppercase label (the website's `.label`).
    func monoLabel(_ size: CGFloat = 11, color: Color = .inkMuted) -> some View {
        font(.mono(size)).tracking(size * 0.12).textCase(.uppercase).foregroundStyle(color)
    }
    /// White/dark card with a hairline border and soft shadow.
    func cardStyle(radius: CGFloat = 28, padding: CGFloat = 20) -> some View {
        self.padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.card, in: RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: radius, style: .continuous).strokeBorder(Color.line))
            .shadow(color: .black.opacity(0.04), radius: 10, y: 4)
    }
}

/// "• TRACKER" — small orange dot plus a mono label.
struct Eyebrow: View {
    let text: String
    var body: some View {
        HStack(spacing: 8) {
            Circle().fill(Color.pumpkin).frame(width: 7, height: 7)
            Text(text).monoLabel()
        }
    }
}

// MARK: - Logo

/// The CVAscender logo: lapis tile with white and orange chevrons, then "CV" in orange and "Ascender" in lapis.
struct Logo: View {
    var size: CGFloat = 22
    var body: some View {
        HStack(spacing: size * 0.28) {
            LogoMark(size: size * 1.15)
            (Text("CV").foregroundColor(.pumpkin) + Text("Ascender").foregroundColor(.lapis))
                .font(.geist(size, .bold))
                .tracking(-size * 0.035)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("CVAscender")
    }
}

/// The icon from the logo SVG (64×64 viewBox): white chevron 18,34 → 32,20 → 46,34 and
/// orange chevron 18,48 → 32,34 → 46,48, stroke 7, round caps.
struct LogoMark: View {
    var size: CGFloat = 26
    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.22, style: .continuous)
            .fill(Color(UIColor(hex: 0x26619C)))
            .frame(width: size, height: size)
            .overlay(
                Canvas { ctx, s in
                    let k = s.width / 64
                    func chevron(_ top: CGFloat) -> Path {
                        var p = Path()
                        p.move(to: CGPoint(x: 18 * k, y: (top + 14) * k))
                        p.addLine(to: CGPoint(x: 32 * k, y: top * k))
                        p.addLine(to: CGPoint(x: 46 * k, y: (top + 14) * k))
                        return p
                    }
                    let style = StrokeStyle(lineWidth: 7 * k, lineCap: .round, lineJoin: .round)
                    ctx.stroke(chevron(20), with: .color(.white), style: style)
                    ctx.stroke(chevron(34), with: .color(Color(UIColor(hex: 0xFF7518))), style: style)
                }
            )
    }
}

// MARK: - Buttons

struct PillButtonStyle: ButtonStyle {
    enum Kind { case primary, signal, ghost, ink }
    var kind: Kind = .primary
    var height: CGFloat = 48

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.geist(15, .semibold))
            .padding(.horizontal, 20)
            .frame(minHeight: height)
            .foregroundStyle(foreground)
            .background(background, in: Capsule())
            .overlay(Capsule().strokeBorder(kind == .ghost ? Color.line : .clear))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
    private var foreground: Color { kind == .ghost ? .ink : (kind == .ink ? .paper : .white) }
    private var background: Color {
        switch kind {
        case .primary: return .lapis
        case .signal: return .pumpkin
        case .ghost: return .card
        case .ink: return .ink
        }
    }
}

extension ButtonStyle where Self == PillButtonStyle {
    static var pill: PillButtonStyle { PillButtonStyle() }
    static func pill(_ kind: PillButtonStyle.Kind, height: CGFloat = 48) -> PillButtonStyle { PillButtonStyle(kind: kind, height: height) }
}

/// The website's `.chip` / `.chip-on`.
struct Chip: View {
    let label: String
    var icon: String? = nil
    var selected = false
    var count: Int? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let icon { Text(icon) }
                Text(label).font(.geist(14, .medium))
                if let count { Text("\(count)").font(.geist(12, .semibold)).opacity(0.7) }
            }
            .padding(.horizontal, 14)
            .frame(height: 36)
            .foregroundStyle(selected ? Color.white : Color.inkSoft)
            .background(selected ? Color.lapis : Color.card, in: Capsule())
            .overlay(Capsule().strokeBorder(selected ? Color.lapis : Color.line))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? .isSelected : [])
    }
}

/// Wraps chips onto several lines.
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0, widest: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x > 0 && x + size.width > maxWidth { y += rowHeight + spacing; x = 0; rowHeight = 0 }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
            widest = max(widest, x - spacing)
        }
        return CGSize(width: proposal.width ?? widest, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x > bounds.minX && x + size.width > bounds.maxX { y += rowHeight + spacing; x = bounds.minX; rowHeight = 0 }
            view.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}

// MARK: - Badges

/// "Real · source checked" (green) or "Not checked yet" (amber).
struct TrustBadge: View {
    let verified: Bool
    var solid = false
    var body: some View {
        HStack(spacing: 4) {
            if verified { Image(systemName: "checkmark.shield").font(.system(size: 11, weight: .semibold)) }
            Text(verified ? "Real · source checked" : "Not checked yet")
        }
        .font(.geist(11, .semibold))
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .foregroundStyle(solid ? (verified ? Color(UIColor(hex: 0x065F46)) : Color(UIColor(hex: 0x92400E))) : (verified ? Color.okText : Color.warnText))
        .background(solid ? Color.white.opacity(0.9) : (verified ? Color.okSoft : Color.warnSoft), in: Capsule())
    }
}

/// Orange progress ring with the score and "MATCH" (the website's MatchRing).
struct MatchRing: View {
    let score: Int
    var size: CGFloat = 48
    var dark = false

    var body: some View {
        ZStack {
            Circle().fill(dark ? Color(UIColor(hex: 0x101828)) : Color.white.opacity(0.95))
            Circle().stroke(dark ? Color(UIColor(hex: 0x344054)) : Color(UIColor(hex: 0xE2E7F0)), lineWidth: 3)
            Circle().trim(from: 0, to: CGFloat(score) / 100)
                .stroke(Color(UIColor(hex: 0xFF7518)), style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 0) {
                Text("\(score)").font(.geist(size * 0.31, .semibold))
                Text("MATCH").font(.geist(size * 0.16, .medium)).tracking(0.6).opacity(0.6)
            }
            .foregroundStyle(dark ? Color.white : Color(UIColor(hex: 0x101828)))
        }
        .frame(width: size, height: size)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(score)% match")
    }
}

/// Small pill on top of photos: dark glass with white text, optional colour dot.
struct PhotoTag: View {
    let text: String
    var dot: Color? = nil
    var style: Style = .glass
    enum Style { case glass, white, amber, red }

    var body: some View {
        HStack(spacing: 6) {
            if let dot { Circle().fill(dot).frame(width: 8, height: 8) }
            Text(text).lineLimit(1)
        }
        .font(.geist(11, .semibold))
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .foregroundStyle(fg)
        .background(bg, in: Capsule())
    }
    private var fg: Color {
        switch style {
        case .glass, .red: return .white
        case .white: return Color(UIColor(hex: 0x101828))
        case .amber: return Color(UIColor(hex: 0x451A03))
        }
    }
    private var bg: AnyShapeStyle {
        switch style {
        case .glass: return AnyShapeStyle(Material.ultraThinMaterial)
        case .white: return AnyShapeStyle(Color.white.opacity(0.9))
        case .amber: return AnyShapeStyle(Color(UIColor(hex: 0xFCD34D)).opacity(0.92))
        case .red: return AnyShapeStyle(Color.red.opacity(0.85))
        }
    }
}

// MARK: - Poster art (components/Visual.js)

/// FNV-1a hash, the same as the website, so each listing gets the same art everywhere.
func stableHash(_ s: String) -> Int {
    var h: UInt32 = 2166136261
    for b in s.utf8 { h = (h ^ UInt32(b)) &* 16777619 }
    return Int(h & 0x7FFF_FFFF)
}

/// Generated Swiss-poster art in the listing's category colour, with the
/// illustrative photo on top when it loads (same order as the website).
/// Clubs never get a photo: their logo is the image.
struct ListingVisual: View {
    let o: Opportunity
    var photo = true
    var caption = true
    var credit = false
    @State private var photoShown = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                PosterArt(o: o)
                if !photoShown && caption {
                    OrgLogo(o: o, size: min(geo.size.width, geo.size.height) * (o.isClub ? 0.44 : 0.3))
                        .position(x: geo.size.width / 2, y: geo.size.height * 0.4)
                    Text(o.type)
                        .font(.geist(min(88, geo.size.width * 0.22), .bold))
                        .tracking(-2)
                        .foregroundStyle(.white.opacity(0.2))
                        .lineLimit(1)
                        .fixedSize()
                        .position(x: geo.size.width / 2 + 16, y: geo.size.height - 12)
                        .frame(width: geo.size.width, alignment: .leading)
                }
                if photo, let url = o.photoURL {
                    AsyncImage(url: url, transaction: Transaction(animation: .easeOut(duration: 0.6))) { phase in
                        if let image = phase.image {
                            image.resizable().scaledToFill()
                                .frame(width: geo.size.width, height: geo.size.height)
                                .clipped()
                                .onAppear { photoShown = true }
                                .overlay(alignment: .topTrailing) {
                                    if credit {
                                        Text("Illustrative photo")
                                            .font(.geist(10, .medium))
                                            .foregroundStyle(.white.opacity(0.85))
                                            .padding(.horizontal, 8).padding(.vertical, 3)
                                            .background(.black.opacity(0.4), in: Capsule())
                                            .padding(12)
                                    }
                                }
                        }
                    }
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
            .clipped()
        }
    }
}

struct PosterArt: View {
    let o: Opportunity
    var body: some View {
        let h = stableHash(o.id)
        let hue = Color.hue(o.categories.first)
        let hue2 = Color.hue(o.categories.count > 1 ? o.categories[1] : o.categories.first)
        let variant = h % 4
        let rot = Double(h % 7) * 15
        Canvas { ctx, size in
            ctx.fill(Path(CGRect(origin: .zero, size: size)), with: .color(hue))
            let gx = size.width * CGFloat(20 + h % 60) / 100
            ctx.fill(Path(CGRect(origin: .zero, size: size)),
                     with: .radialGradient(Gradient(colors: [hue2.opacity(0.8), hue2.opacity(0)]),
                                           center: CGPoint(x: gx, y: 0), startRadius: 0, endRadius: max(size.width, size.height) * 0.75))
            // Pattern, drawn in a 400×300 box scaled to fill (like the website's SVG viewBox).
            let scale = max(size.width / 400, size.height / 300)
            var pattern = ctx
            pattern.translateBy(x: (size.width - 400 * scale) / 2, y: (size.height - 300 * scale) / 2)
            pattern.scaleBy(x: scale, y: scale)
            pattern.translateBy(x: 300, y: 120)
            pattern.rotate(by: .degrees(rot))
            pattern.translateBy(x: -300, y: -120)
            var path = Path()
            switch variant {
            case 0:
                for r in stride(from: 40.0, through: 240.0, by: 40.0) { path.addEllipse(in: CGRect(x: 300 - r, y: 90 - r, width: r * 2, height: r * 2)) }
            case 1:
                for k in 0..<14 { path.move(to: CGPoint(x: -100 + Double(k) * 40, y: -50)); path.addLine(to: CGPoint(x: 100 + Double(k) * 40, y: 350)) }
            case 2:
                for i in 0..<8 {
                    let k = Double(i)
                    path.addRoundedRect(in: CGRect(x: 260 - k * 22, y: 60 - k * 12, width: 60 + k * 44, height: 60 + k * 44), cornerSize: CGSize(width: 18, height: 18))
                }
            default:
                for i in 0..<6 {
                    let k = Double(i)
                    path.move(to: CGPoint(x: -20, y: 260 - k * 34))
                    path.addQuadCurve(to: CGPoint(x: 420, y: 240 - k * 34), control: CGPoint(x: 200, y: 120 - k * 34))
                }
            }
            pattern.stroke(path, with: .color(.white.opacity(0.22)), lineWidth: 1.5)
            var dot = ctx
            dot.translateBy(x: (size.width - 400 * scale) / 2, y: (size.height - 300 * scale) / 2)
            dot.scaleBy(x: scale, y: scale)
            let r = Double(26 + h % 30)
            let c = CGPoint(x: Double(60 + h % 260), y: Double(60 + h % 140))
            dot.fill(Path(ellipseIn: CGRect(x: c.x - r, y: c.y - r, width: r * 2, height: r * 2)), with: .color(.white.opacity(0.14)))
        }
    }
}

/// The organiser's website icon on a white tile, or their initials.
struct OrgLogo: View {
    let o: Opportunity
    var size: CGFloat = 46

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size * 0.28, style: .continuous).fill(Color.white)
            if let url = o.logoURL {
                AsyncImage(url: url) { phase in
                    if let image = phase.image { image.resizable().scaledToFit().padding(size * 0.16) } else { initials }
                }
            } else {
                initials
            }
        }
        .frame(width: size, height: size)
        .shadow(color: .black.opacity(0.15), radius: 6, y: 2)
    }

    private var initials: some View {
        Text(o.org.split(separator: " ").prefix(2).compactMap { word in word.first.map { String($0) } }.joined().uppercased())
            .font(.geist(size * 0.34, .bold))
            .foregroundStyle(Color(UIColor(hex: 0x26619C)))
    }
}

// MARK: - Toast

/// "Saved", "Link copied"… — a small capsule that appears at the top.
struct ToastView: View {
    let text: String
    var body: some View {
        Text(text)
            .font(.geist(14, .semibold))
            .foregroundStyle(Color.paper)
            .padding(.horizontal, 18)
            .padding(.vertical, 11)
            .background(Color.ink, in: Capsule())
            .shadow(color: .black.opacity(0.2), radius: 12, y: 6)
    }
}

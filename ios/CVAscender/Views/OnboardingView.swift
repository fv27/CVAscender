import SwiftUI

/// The website's 4-step onboarding: Canton → You → Interests → Skills.
/// Also opened from Settings/Profile to change answers (editing = true).
struct OnboardingView: View {
    let initial: Profile
    let editing: Bool
    let onDone: (Profile) -> Void
    var onCancel: (() -> Void)?

    @State private var p: Profile
    @State private var step: Int
    private let cat = Catalog.shared
    private let steps = ["Canton", "You", "Interests", "Skills"]

    init(initial: Profile, editing: Bool, startStep: Int, onDone: @escaping (Profile) -> Void, onCancel: (() -> Void)? = nil) {
        self.initial = initial
        self.editing = editing
        self.onDone = onDone
        self.onCancel = onCancel
        _p = State(initialValue: initial)
        _step = State(initialValue: min(max(startStep, 0), 3))
    }

    private func valid(_ s: Int) -> Bool {
        switch s {
        case 0: return !p.canton.isEmpty && p.city.trimmingCharacters(in: .whitespaces).count > 1
        case 1: return (10...25).contains(p.age)
        case 2: return !p.interests.isEmpty
        default: return !p.skills.isEmpty
        }
    }
    private var allValid: Bool { (0...3).allSatisfy(valid) }

    var body: some View {
        VStack(spacing: 0) {
            topBar
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    titleBlock
                    switch step {
                    case 0: cantonStep
                    case 1: aboutStep
                    case 2: interestsStep
                    default: skillsStep
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 18)
                .padding(.bottom, 30)
            }
            .scrollDismissesKeyboard(.interactively)
            bottomBar
        }
        .background(Color.paper.ignoresSafeArea())
        .animation(.easeInOut(duration: 0.25), value: step)
    }

    private var topBar: some View {
        VStack(spacing: 14) {
            HStack {
                Logo(size: 22)
                Spacer()
                if editing, let onCancel {
                    Button("Cancel", action: onCancel).font(.geist(15, .medium)).foregroundStyle(Color.inkSoft)
                }
                ThemeToggle()
            }
            HStack(spacing: 6) {
                ForEach(0..<4) { i in
                    Capsule().fill(i <= step ? Color.pumpkin : Color.line).frame(height: 4)
                }
            }
            HStack(spacing: 6) {
                ForEach(0..<4) { i in
                    Button { if editing || i <= step || valid(step) { step = i } } label: {
                        Text(steps[i]).font(.geist(12.5, .medium))
                            .foregroundStyle(i == step ? Color.white : Color.inkSoft)
                            .padding(.horizontal, 12).frame(height: 30)
                            .background(i == step ? Color.lapis : Color.card, in: Capsule())
                            .overlay(Capsule().strokeBorder(i == step ? Color.clear : Color.line))
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
    }

    private var titleBlock: some View {
        let titles = ["Where do you live?", "Tell us about you", "What are you into?", "What do you want to build?"]
        let subs = [
            editing ? "We’ll show clubs and programmes near you, plus everything open nationwide." : "Olympiads, competitions, clubs, volunteering and more in Switzerland — matched to you, with a CV that builds itself.",
            "Only used to hide things you can’t join yet. Everything stays on this phone.",
            "Pick as many as you like. This shapes your feed the most.",
            "Pick the skills you want to grow — listings that build them rank higher.",
        ]
        return VStack(alignment: .leading, spacing: 10) {
            Text(titles[step]).display(44).foregroundStyle(Color.ink)
            Text(subs[step]).font(.geist(16)).foregroundStyle(Color.inkSoft)
        }
    }

    // Step 1: canton grid + town
    private var cantonStep: some View {
        VStack(alignment: .leading, spacing: 18) {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 104), spacing: 8)], spacing: 8) {
                ForEach(cat.regions(for: p.country), id: \.code) { c in
                    let on = p.canton == c.code
                    Button {
                        if p.canton != c.code { p.canton = c.code; p.city = "" }
                    } label: {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(c.name).font(.geist(14, .semibold)).lineLimit(1).minimumScaleFactor(0.8)
                            Text(cat.shortCode(c.code)).font(.mono(11)).opacity(0.7)
                        }
                        .foregroundStyle(on ? Color.white : Color.ink)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(on ? Color.lapis : Color.card, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(on ? Color.clear : Color.line))
                    }
                    .buttonStyle(.plain)
                }
            }
            if !p.canton.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("City or town").monoLabel()
                    TextField("e.g. \(cat.file.towns[p.canton]?.first ?? cat.country(p.country).example)",
                              text: Binding(get: { p.city }, set: { p.city = String($0.prefix(60)) }))
                        .font(.geist(17))
                        .textContentType(.addressCity)
                        .padding(.horizontal, 16).frame(height: 54)
                        .background(Color.card, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(Color.line))
                    if let towns = cat.file.towns[p.canton] {
                        FlowLayout {
                            ForEach(towns.prefix(10), id: \.self) { t in
                                Chip(label: t, selected: p.city == t) { p.city = t }
                            }
                        }
                    }
                }
                .transition(.opacity)
            }
            TextField("Your first name (optional)", text: Binding(get: { p.name }, set: { p.name = String($0.prefix(40)) }))
                .font(.geist(17))
                .textContentType(.givenName)
                .padding(.horizontal, 16).frame(height: 54)
                .background(Color.card, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(Color.line))
        }
    }

    // Step 2: age + school year
    private var aboutStep: some View {
        VStack(alignment: .leading, spacing: 22) {
            VStack(alignment: .leading, spacing: 10) {
                Text("Age").monoLabel()
                HStack(spacing: 18) {
                    roundButton("minus") { if p.age > 10 { p.age -= 1 } }
                    Text("\(p.age)").display(64).foregroundStyle(Color.ink).frame(minWidth: 90)
                        .contentTransition(.numericText())
                    roundButton("plus") { if p.age < 25 { p.age += 1 } }
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .cardStyle(padding: 12)
            }
            VStack(alignment: .leading, spacing: 10) {
                Text("School year").monoLabel()
                FlowLayout {
                    ForEach(cat.schoolYears(for: p.country), id: \.value) { y in
                        Chip(label: y.label, selected: p.year == y.value) { p.year = y.value }
                    }
                }
            }
        }
    }

    private func roundButton(_ icon: String, action: @escaping () -> Void) -> some View {
        Button { withAnimation { action() } } label: {
            Image(systemName: icon).font(.system(size: 20, weight: .bold)).foregroundStyle(Color.ink)
                .frame(width: 52, height: 52).background(Color.soft, in: Circle())
        }
        .buttonStyle(.plain)
    }

    // Step 3: big colour tiles with a check (website / TikTok "Choose what you like")
    private var interestsStep: some View {
        LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
            ForEach(cat.file.interests, id: \.id) { i in
                let on = p.interests.contains(i.id)
                let hue = Color(hex: i.hue)
                Button { toggle(&p.interests, i.id) } label: {
                    ZStack(alignment: .bottomLeading) {
                        RoundedRectangle(cornerRadius: 22, style: .continuous).fill(on ? hue : Color.card)
                        Circle().fill(hue.opacity(on ? 0.0 : 0.12)).frame(width: 90, height: 90).offset(x: 90, y: -50)
                        Text(i.label).font(.geist(16, .semibold)).foregroundStyle(on ? Color.white : Color.ink).padding(14)
                    }
                    .frame(height: 96)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .overlay(RoundedRectangle(cornerRadius: 22, style: .continuous).strokeBorder(on ? Color.clear : Color.line))
                    .overlay(alignment: .topTrailing) {
                        Image(systemName: on ? "checkmark" : "plus")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundStyle(on ? Color.white : Color.inkMuted)
                            .frame(width: 30, height: 30)
                            .background(on ? Color.white.opacity(0.22) : Color.soft, in: Circle())
                            .padding(10)
                    }
                }
                .buttonStyle(.plain)
                .sensoryFeedback(.selection, trigger: on)
            }
        }
    }

    // Step 4: skills
    private var skillsStep: some View {
        FlowLayout(spacing: 10) {
            ForEach(cat.file.skills, id: \.self) { s in
                let on = p.skills.contains(s)
                Button { toggle(&p.skills, s) } label: {
                    HStack(spacing: 6) {
                        Text(s).font(.geist(15, .medium))
                        Image(systemName: on ? "checkmark" : "plus").font(.system(size: 11, weight: .bold))
                    }
                    .foregroundStyle(on ? Color.white : Color.ink)
                    .padding(.horizontal, 16).frame(height: 42)
                    .background(on ? Color.lapis : Color.card, in: Capsule())
                    .overlay(Capsule().strokeBorder(on ? Color.clear : Color.line))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var bottomBar: some View {
        HStack(spacing: 10) {
            if step > 0 {
                Button { step -= 1 } label: {
                    Image(systemName: "arrow.left").font(.system(size: 17, weight: .semibold))
                        .frame(width: 52, height: 52)
                        .foregroundStyle(Color.ink)
                        .background(Color.card, in: Circle())
                        .overlay(Circle().strokeBorder(Color.line))
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Back")
            }
            Spacer()
            if editing && step < 3 {
                Button("Next") { step += 1 }.buttonStyle(.pill(.ghost, height: 52)).disabled(!valid(step))
            }
            if editing {
                Button { finish() } label: { HStack(spacing: 6) { Text("Save changes"); Image(systemName: "checkmark") } }
                    .buttonStyle(.pill(.primary, height: 52))
                    .disabled(!allValid)
                    .opacity(allValid ? 1 : 0.4)
            } else {
                Button {
                    if step < 3 { step += 1 } else { finish() }
                } label: {
                    HStack(spacing: 6) {
                        Text(step < 3 ? "Continue" : "Build my feed")
                        Image(systemName: "arrow.right")
                    }
                }
                .buttonStyle(.pill(step < 3 ? .primary : .signal, height: 52))
                .disabled(!valid(step))
                .opacity(valid(step) ? 1 : 0.4)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color.paper.shadow(.drop(color: .black.opacity(0.06), radius: 8, y: -2)))
    }

    private func finish() {
        var out = p
        out.city = out.city.trimmingCharacters(in: .whitespaces)
        out.name = out.name.trimmingCharacters(in: .whitespaces)
        onDone(out)
    }

    private func toggle(_ list: inout [String], _ value: String) {
        if let i = list.firstIndex(of: value) { list.remove(at: i) } else { list.append(value) }
    }
}

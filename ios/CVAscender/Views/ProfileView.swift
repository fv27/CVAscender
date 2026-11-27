import SwiftUI
import UIKit

/// Profile & CV: header with stats, skills tracker, own activities and the auto-built CV.
/// (The CV gap analysis is intentionally not in the app.)
struct ProfileView: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @State private var addingActivity = false
    @State private var confirmReset = false
    private let cat = Catalog.shared

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                HStack { Spacer(); ThemeToggle() }
                if let p = store.profile { header(p) }
                skillsCard
                cvSection
                Button("Reset all my data") { confirmReset = true }
                    .font(.geist(13)).foregroundStyle(Color.inkMuted)
                    .padding(.top, 8)
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 110)
        }
        .background(Color.paper.ignoresSafeArea())
        .sheet(isPresented: $addingActivity) {
            AddActivitySheet().presentationDetents([.large]).presentationDragIndicator(.visible)
        }
        .confirmationDialog("Delete your profile, My path and CV from this phone?", isPresented: $confirmReset, titleVisibility: .visible) {
            Button("Yes, delete", role: .destructive) { store.resetAll() }
        }
    }

    // MARK: Header

    private func header(_ p: Profile) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 16) {
                Text(String((p.name.isEmpty ? "You" : p.name).prefix(1)).uppercased())
                    .font(.geist(24, .bold))
                    .foregroundStyle(Color.paper)
                    .frame(width: 64, height: 64)
                    .background(Color.ink, in: Circle())
                VStack(alignment: .leading, spacing: 6) {
                    Text(p.name.isEmpty ? "Your profile" : p.name).display(34).foregroundStyle(Color.ink)
                    Text("\(p.city), \(cat.cantonName(p.canton)), \(cat.country(p.country).name) · Age \(p.age) · \(cat.yearLabel(p.year, country: p.country))")
                        .font(.geist(14.5)).foregroundStyle(Color.inkSoft)
                }
            }
            Button("Edit") { router.editStep = 0 }.buttonStyle(.pill(.ghost, height: 42))
            HStack(spacing: 0) {
                stat(store.count(.saved) + store.count(.applied) + store.count(.completed), "Saved")
                Divider()
                stat(store.count(.applied), "Applied")
                Divider()
                stat(store.count(.completed) + store.custom.count, "Done")
                Divider()
                stat(store.skillsGained.count, "Skills")
            }
            .frame(height: 70)
            .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(Color.line))
            FlowLayout(spacing: 8) {
                ForEach(p.skills, id: \.self) { s in
                    HStack(spacing: 5) {
                        Image(systemName: "sparkle").font(.system(size: 10, weight: .bold)).foregroundStyle(Color.pumpkin)
                        Text(s).font(.geist(13.5, .semibold)).foregroundStyle(Color.ink)
                    }
                    .padding(.horizontal, 12).frame(height: 30)
                    .background(Color.pumpkinSoft, in: Capsule())
                }
            }
            Text("Saved on this phone only — nothing is uploaded.")
                .font(.geist(13.5)).foregroundStyle(Color.pumpkin)
            Link(destination: SubscriptionStore.mailURL()) {
                Label("Questions or ideas? \(SubscriptionStore.contactEmail)", systemImage: "envelope")
            }
            .font(.geist(13.5, .semibold)).foregroundStyle(Color.lapis)
        }
        .cardStyle()
    }

    private func stat(_ n: Int, _ label: String) -> some View {
        VStack(spacing: 4) {
            Text("\(n)").display(26).foregroundStyle(Color.ink)
            Text(label).monoLabel(9.5)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: Skills you're building

    private var skillsCard: some View {
        let gained = store.skillsGained
        let wanted = store.profile?.skills ?? []
        let extra = gained.keys.filter { !wanted.contains($0) }.sorted()
        return VStack(alignment: .leading, spacing: 14) {
            Text("Skills you’re building").monoLabel()
            ForEach(wanted, id: \.self) { s in
                let n = gained[s] ?? 0
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(s).font(.geist(15, .semibold)).foregroundStyle(Color.ink)
                        Spacer()
                        Text(n == 0 ? "Not yet" : "\(n) done").font(.geist(13)).foregroundStyle(Color.inkMuted)
                    }
                    GeometryReader { geo in
                        Capsule().fill(Color.soft)
                            .overlay(alignment: .leading) {
                                Capsule().fill(Color.pumpkin).frame(width: geo.size.width * min(1, CGFloat(n) / 3))
                            }
                    }
                    .frame(height: 6)
                }
            }
            if !extra.isEmpty {
                Text("Also gained: " + extra.joined(separator: ", ")).font(.geist(13)).foregroundStyle(Color.inkSoft)
            }
            VStack(spacing: 8) {
                Text("Add your first activity").font(.geist(16, .semibold)).foregroundStyle(Color.ink)
                Text("Mark something as completed, or add a club or job you already do.")
                    .font(.geist(13.5)).foregroundStyle(Color.inkMuted).multilineTextAlignment(.center)
                Button { addingActivity = true } label: { Label("Add activity", systemImage: "plus") }
                    .buttonStyle(.pill(.ghost, height: 42))
            }
            .frame(maxWidth: .infinity)
            .padding(18)
            .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(Color.line, style: StrokeStyle(lineWidth: 1.5, dash: [6, 5])))
        }
        .cardStyle()
    }

    // MARK: Your CV

    private struct CVEntry: Identifiable {
        let id: String
        let title: String
        let org: String
        let line: String?
    }
    private struct CVGroup: Identifiable {
        let title: String
        let entries: [CVEntry]
        var id: String { title }
    }

    private var cvGroups: [CVGroup] {
        var bySection: [String: [CVEntry]] = [:]
        for item in store.items(.completed) {
            guard let section = item.o.cvSection else { continue }
            bySection[section, default: []].append(CVEntry(id: item.o.id, title: item.o.title, org: item.o.org, line: item.t.cvLine))
        }
        for c in store.custom {
            bySection[c.cvSection, default: []].append(CVEntry(id: c.id, title: c.title, org: c.org, line: c.cvLine.isEmpty ? nil : c.cvLine))
        }
        let order = ["Leadership & responsibility", "Work experience", "Competitions & awards", "Academic programmes",
                     "Volunteering", "International experience", "Clubs & activities"]
        return order.compactMap { key in bySection[key].map { CVGroup(title: key, entries: $0) } }
    }

    private var cvText: String {
        var lines: [String] = []
        if let p = store.profile {
            lines.append(p.name.isEmpty ? "Curriculum vitae" : p.name)
            lines.append("\(p.city), \(cat.cantonName(p.canton)), \(cat.country(p.country).name) · \(cat.yearLabel(p.year, country: p.country))")
            lines.append("")
        }
        for g in cvGroups {
            lines.append(g.title.uppercased())
            for e in g.entries { lines.append("• \(e.title) — \(e.org)" + (e.line.map { ": \($0)" } ?? "")) }
            lines.append("")
        }
        let skills = store.skillsGained.keys.sorted()
        if !skills.isEmpty { lines.append("SKILLS"); lines.append(skills.joined(separator: ", ")) }
        return lines.joined(separator: "\n")
    }

    private var cvSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Eyebrow(text: "Auto-built from your completed activities")
            Text("Your CV").display(40).foregroundStyle(Color.ink)
            HStack(spacing: 8) {
                Button { addingActivity = true } label: { Label("Add activity", systemImage: "plus") }
                    .buttonStyle(.pill(.ghost, height: 44))
                Button {
                    UIPasteboard.general.string = cvText
                    router.notify("CV copied")
                } label: { Label("Copy", systemImage: "doc.on.doc") }
                    .buttonStyle(.pill(.ghost, height: 44))
                ShareLink(item: cvText) { Label("Share", systemImage: "square.and.arrow.up") }
                    .buttonStyle(.pill(.primary, height: 44))
            }
            .labelStyle(.titleAndIcon)
            VStack(alignment: .leading, spacing: 14) {
                if let p = store.profile {
                    Text(p.name.isEmpty ? "Curriculum vitae" : p.name).display(34).foregroundStyle(Color.ink)
                    Text("\(p.city), \(cat.cantonName(p.canton)), \(cat.country(p.country).name) · \(cat.yearLabel(p.year, country: p.country))")
                        .font(.geist(14.5)).foregroundStyle(Color.inkSoft)
                }
                Rectangle().fill(Color.line).frame(height: 1)
                if cvGroups.isEmpty {
                    Text("Mark opportunities as completed, or add your own activities, and your CV will build itself here.")
                        .font(.geist(14.5)).foregroundStyle(Color.inkSoft)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                } else {
                    ForEach(cvGroups) { g in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(g.title).monoLabel(10.5, color: .lapis)
                            ForEach(g.entries) { e in
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(e.title).font(.geist(15, .semibold)).foregroundStyle(Color.ink)
                                    Text(e.line ?? e.org).font(.geist(13.5)).foregroundStyle(Color.inkSoft)
                                }
                            }
                        }
                    }
                }
            }
            .padding(22)
            .frame(maxWidth: .infinity, alignment: .leading)
            .overlay(RoundedRectangle(cornerRadius: 24, style: .continuous).strokeBorder(Color.line, style: StrokeStyle(lineWidth: 1.5, dash: [6, 5])))
        }
        .padding(.top, 10)
    }
}

/// "Add an activity": something done outside CVAscender — it counts too.
struct AddActivitySheet: View {
    @EnvironmentObject private var store: StudentStore
    @EnvironmentObject private var router: Router
    @Environment(\.dismiss) private var dismiss
    @State private var a = CustomActivity(title: "", org: "", cvSection: "Clubs & activities", cvLine: "")
    private let sections = ["Clubs & activities", "Leadership & responsibility", "Work experience", "Competitions & awards",
                            "Academic programmes", "Volunteering", "International experience"]

    private var valid: Bool {
        !a.title.trimmingCharacters(in: .whitespaces).isEmpty && !a.org.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    Text("Something you did that isn’t on CVAscender — it counts too.")
                        .font(.geist(15)).foregroundStyle(Color.inkSoft)
                    field("What did you do?", "e.g. Captain of the U17 football team", $a.title, limit: 100)
                    field("Where / with whom?", "e.g. FC Winterthur", $a.org, limit: 100)
                    VStack(alignment: .leading, spacing: 8) {
                        Text("CV section").monoLabel()
                        FlowLayout {
                            ForEach(sections, id: \.self) { s in Chip(label: s, selected: a.cvSection == s) { a.cvSection = s } }
                        }
                    }
                    field("One line for your CV (optional)", "e.g. Led weekly training for 15 players", $a.cvLine, limit: 200)
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Skills gained").monoLabel()
                        FlowLayout {
                            ForEach(Catalog.shared.file.skills, id: \.self) { s in
                                Chip(label: s, selected: a.skills.contains(s)) {
                                    if let i = a.skills.firstIndex(of: s) { a.skills.remove(at: i) } else { a.skills.append(s) }
                                }
                            }
                        }
                    }
                }
                .padding(20)
            }
            .background(Color.paper)
            .navigationTitle("Add an activity")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Add to CV") {
                        var clean = a
                        clean.title = clean.title.trimmingCharacters(in: .whitespacesAndNewlines)
                        clean.org = clean.org.trimmingCharacters(in: .whitespacesAndNewlines)
                        clean.cvLine = clean.cvLine.trimmingCharacters(in: .whitespacesAndNewlines)
                        if store.custom.count < 200 { store.custom.append(clean) }
                        router.notify("Added to your CV 🎉")
                        dismiss()
                    }
                    .font(.geist(15, .semibold))
                    .disabled(!valid)
                }
            }
        }
    }

    /// Text field with a length limit (keeps saved data small and tidy).
    private func field(_ label: String, _ placeholder: String, _ text: Binding<String>, limit: Int) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label).monoLabel()
            TextField(placeholder, text: Binding(get: { text.wrappedValue }, set: { text.wrappedValue = String($0.prefix(limit)) }))
                .font(.geist(16))
                .padding(.horizontal, 16).frame(height: 52)
                .background(Color.card, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(Color.line))
        }
    }
}

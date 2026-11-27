import Foundation
import UserNotifications

/// Local notifications for deadlines and "don't forget to apply" nudges.
/// Everything is scheduled on the device — no server, no push service.
enum Reminders {
    private static var center: UNUserNotificationCenter { .current() }

    private static func ask() async -> Bool {
        (try? await center.requestAuthorization(options: [.alert, .sound, .badge])) ?? false
    }

    /// Reminds the student `daysBefore` days before the official deadline, at 9:00.
    static func scheduleDeadline(for o: Opportunity, daysBefore: Int = 3) async -> Bool {
        guard let deadline = o.deadlineDate, deadline > Date(), await ask() else { return false }
        var fire = Calendar.current.date(byAdding: .day, value: -daysBefore, to: deadline) ?? deadline
        fire = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: fire) ?? fire
        if fire <= Date() { fire = Date().addingTimeInterval(120) }
        return await add(id: o.id, title: "Deadline coming up", body: "\(o.title) — \(o.deadlineLabel.lowercased()).", at: fire)
    }

    /// A nudge in `days` days to look at a saved listing again.
    static func scheduleNudge(for o: Opportunity, inDays days: Int = 7) async -> Bool {
        guard await ask() else { return false }
        let base = Calendar.current.date(byAdding: .day, value: days, to: Date()) ?? Date()
        let fire = Calendar.current.date(bySettingHour: 17, minute: 0, second: 0, of: base) ?? base
        return await add(id: o.id, title: "Still interested?", body: "You saved “\(o.title)”. Check the dates and apply on the official site.", at: fire)
    }

    /// "Your free trial ends in 2 days" — scheduled when a trial starts.
    static func scheduleTrialEnding(at end: Date) async {
        guard await ask() else { return }
        let fire = Calendar.current.date(byAdding: .day, value: -2, to: end) ?? end
        guard fire > Date() else { return }
        _ = await add(id: "trial-ending", title: "Your free trial ends in 2 days",
                      body: "After that your CVAscender subscription starts. You can cancel anytime in Settings → Apple ID → Subscriptions.", at: fire)
    }

    private static func add(id: String, title: String, body: String, at date: Date) async -> Bool {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        let comps = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)
        let request = UNNotificationRequest(identifier: "cva-\(id)", content: content, trigger: trigger)
        do { try await center.add(request); return true } catch { return false }
    }

    static func isScheduled(id: String) async -> Bool {
        await center.pendingNotificationRequests().contains { $0.identifier == "cva-\(id)" }
    }

    static func cancel(id: String) {
        center.removePendingNotificationRequests(withIdentifiers: ["cva-\(id)"])
    }

    static func cancelAll() {
        center.removeAllPendingNotificationRequests()
    }
}

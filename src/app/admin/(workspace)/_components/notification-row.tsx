import { AlertNotification, formatTime } from "@/lib/platform-admin"
import { markAlertNotificationRead } from "../../actions"

/** One alert notification, with Mark read while it is unread. */
export function NotificationRow({ item }: { item: AlertNotification }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${item.read_at ? "border-slate-200 bg-white" : "border-red-200 bg-red-50"}`}
    >
      <div>
        <p className="font-semibold capitalize">
          {item.kind} · {item.severity} · {item.condition.replaceAll("_", " ")}
        </p>
        <p className="text-sm text-slate-600">
          {item.school_name || "Shared infrastructure"} · {item.resource_ref} ·{" "}
          {formatTime(item.created_at)}
        </p>
      </div>
      {!item.read_at && (
        <form action={markAlertNotificationRead}>
          <input type="hidden" name="id" value={item.id} />
          <button className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold">
            Mark read
          </button>
        </form>
      )}
    </div>
  )
}

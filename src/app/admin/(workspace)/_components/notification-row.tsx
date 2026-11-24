import { AlertNotification, formatTime } from "@/lib/platform-admin"
import { markAlertNotificationRead } from "../../actions"
import { conditionLabel, duration, sourceLabel } from "./labels"

/** What happened, in plain words: when it started, and when it ended if it has. */
function story(item: AlertNotification) {
  const stopped = item.condition === "collection_stale"
  if (item.resolved_at)
    return `${stopped ? "Stopped" : "From"} ${formatTime(item.opened_at)}, ${stopped ? "resumed" : "cleared"} ${formatTime(item.resolved_at)} (${duration(item.opened_at, item.resolved_at)})`
  return `${stopped ? "Stopped since" : "Since"} ${formatTime(item.opened_at)} · still open`
}

/**
 * One alert as a single compact line: an alert that opens and resolves is one
 * entry, not two. Mark read covers all of that alert's events.
 */
export function NotificationRow({ item }: { item: AlertNotification }) {
  const open = !item.resolved_at
  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 ${item.unread ? "bg-red-50/60" : "bg-white"}`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${open ? (item.severity === "critical" ? "bg-red-600" : "bg-amber-500") : "bg-emerald-500"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <strong>{item.school_name || "Shared infrastructure"}</strong> ·{" "}
          {conditionLabel(item.condition)} ({sourceLabel(item.source)})
          {open && (
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold capitalize ${item.severity === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
            >
              {item.severity}
            </span>
          )}
        </p>
        <p className="text-xs text-slate-600">
          {story(item)}
          <span className="text-slate-400" title={item.resource_ref}>
            {" "}
            · {item.resource_ref.slice(0, 12)}
            {item.resource_ref.length > 12 ? "…" : ""}
          </span>
        </p>
      </div>
      {item.unread ? (
        <form action={markAlertNotificationRead}>
          <input type="hidden" name="id" value={item.alert_id} />
          <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold">
            Mark read
          </button>
        </form>
      ) : (
        <span className="text-xs text-slate-400">Read</span>
      )}
    </li>
  )
}

/** A bordered list of notification rows. */
export function NotificationList({ items }: { items: AlertNotification[] }) {
  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
      {items.map((item) => (
        <NotificationRow key={item.alert_id} item={item} />
      ))}
    </ul>
  )
}

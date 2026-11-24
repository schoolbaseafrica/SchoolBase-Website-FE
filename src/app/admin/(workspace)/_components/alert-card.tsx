import { CapacityAlert, formatTime } from "@/lib/platform-admin"
import { AcknowledgeForm } from "../acknowledge-form"
import { conditionLabel, sourceLabel } from "./labels"

/** One open capacity alert, with its evidence and acknowledgement. */
export function AlertCard({
  alert,
  compact = false,
}: {
  alert: CapacityAlert
  compact?: boolean
}) {
  const evidence = [
    alert.evidence?.window_minutes
      ? `${alert.evidence.window_minutes} minute evidence window`
      : null,
    alert.evidence?.latest_percent !== undefined
      ? `${alert.evidence.latest_percent.toFixed(1)}% of limit`
      : null,
    alert.evidence?.latest_free_percent !== undefined
      ? `${alert.evidence.latest_free_percent.toFixed(1)}% disk free`
      : null,
    alert.evidence?.last_sample_at !== undefined
      ? `Last sample: ${formatTime(alert.evidence.last_sample_at)}`
      : null,
    alert.evidence?.restart_delta !== undefined
      ? `${alert.evidence.restart_delta} restarts`
      : null,
    alert.evidence?.oom_delta !== undefined
      ? `${alert.evidence.oom_delta} OOM events`
      : null,
  ].filter(Boolean)
  return (
    <div
      className={`rounded-2xl border p-5 ${alert.severity === "critical" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">
          {conditionLabel(alert.condition)} ({sourceLabel(alert.source)})
        </h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize">
          {alert.severity}
        </span>
      </div>
      <p className="mt-2 text-sm">
        {alert.school_name || "Shared infrastructure"} ·{" "}
        <span className="text-slate-500" title={alert.resource_ref}>
          {alert.resource_ref}
        </span>
      </p>
      <p className="mt-2 text-xs text-slate-600">
        Opened {formatTime(alert.opened_at)} · Updated {formatTime(alert.updated_at)}
      </p>
      {!compact && evidence.length > 0 && (
        <p className="mt-2 text-xs text-slate-600">{evidence.join(" · ")}</p>
      )}
      {alert.acknowledged_at ? (
        <p className="mt-3 text-sm font-semibold">
          Acknowledged {formatTime(alert.acknowledged_at)}
        </p>
      ) : compact ? (
        <p className="mt-3 text-sm font-semibold text-red-700">Not acknowledged</p>
      ) : (
        <AcknowledgeForm id={alert.id} />
      )}
    </div>
  )
}

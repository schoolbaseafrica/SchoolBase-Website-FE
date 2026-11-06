import Link from "next/link"
import type { Metadata } from "next"
import {
  CapacityAlert,
  Metrics,
  School,
  SchoolStatus,
  platformRequest,
  formatTime,
  formatMetric,
} from "@/lib/platform-admin"
import { AcknowledgeForm } from "./acknowledge-form"
import { StatusRefresh } from "./status-refresh"

export const metadata: Metadata = {
  title: "School operations",
  robots: { index: false, follow: false },
}

function tone(status: string) {
  if (status === "available" || status === "current")
    return "bg-emerald-50 text-emerald-800"
  if (status === "unavailable" || status === "failed") return "bg-red-50 text-red-800"
  return "bg-slate-100 text-slate-600"
}

function compactImageRef(ref: string | null | undefined) {
  if (!ref) return "Unavailable"
  const combined = /:fe-([a-f0-9]{8,})-be-([a-f0-9]{8,})$/.exec(ref)
  if (combined) return `fe-${combined[1].slice(0, 7)}…be-${combined[2].slice(0, 7)}`
  const digest = /@sha256:([a-f0-9]{64})$/.exec(ref)
  if (digest) return `sha256:${digest[1].slice(0, 8)}…${digest[1].slice(-8)}`
  return ref.length > 28 ? `${ref.slice(0, 14)}…${ref.slice(-10)}` : ref
}

export default async function Page() {
  let operator: { role: string }
  let schools: School[]
  let shared: Metrics
  let alerts: CapacityAlert[]
  try {
    ;[operator, schools, shared, alerts] = await Promise.all([
      platformRequest<{ role: string }>("/operators/me"),
      platformRequest<School[]>("/schools"),
      platformRequest<Metrics>("/metrics/shared"),
      platformRequest<CapacityAlert[]>("/alerts"),
    ])
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">School operations</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          School status could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const rows = await Promise.all(
    schools.map(async (school) => {
      try {
        return {
          school,
          status: await platformRequest<SchoolStatus>(`/schools/${school.id}/status`),
        }
      } catch {
        return { school, status: null }
      }
    })
  )
  return (
    <div>
      <p className="text-xs font-bold tracking-[.2em] text-red-600 uppercase">
        SchoolBase operations
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">School overview</h1>
        <StatusRefresh />
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">
        Availability, staff activity, reported image and capacity are separate signals.
        Missing or old readings remain unavailable.
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Registered schools</p>
          <p className="mt-2 text-3xl font-bold">{schools.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Backend available</p>
          <p className="mt-2 text-3xl font-bold">
            {rows.filter((row) => row.status?.backend.status === "available").length}
            <span className="text-base font-normal text-slate-500">
              {" "}
              / {schools.length}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Shared capacity sources</p>
          <p className="mt-2 text-3xl font-bold">
            {
              shared.sources.filter((source) =>
                source.metrics.some((metric) => metric.collection_status === "current")
              ).length
            }
            <span className="text-base font-normal text-slate-500">
              {" "}
              / {shared.sources.length}
            </span>
          </p>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold">Active capacity alerts</h2>
          <span className="text-sm text-slate-500">{alerts.length} open</span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Acknowledgement records who is investigating. It does not resolve the condition
          or change a school.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 ${alert.severity === "critical" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold capitalize">
                  {alert.condition.replaceAll("_", " ")}
                </h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize">
                  {alert.severity}
                </span>
              </div>
              <p className="mt-2 text-sm">
                {alert.school_name || "Shared infrastructure"} · {alert.resource_ref}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Opened {formatTime(alert.opened_at)} · Updated{" "}
                {formatTime(alert.updated_at)}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {alert.evidence?.window_minutes
                  ? `${alert.evidence.window_minutes} minute evidence window · `
                  : ""}
                {alert.evidence?.latest_percent !== undefined
                  ? `${alert.evidence.latest_percent.toFixed(1)}% of limit`
                  : ""}
                {alert.evidence?.latest_free_percent !== undefined
                  ? `${alert.evidence.latest_free_percent.toFixed(1)}% disk free`
                  : ""}
                {alert.evidence?.last_sample_at !== undefined
                  ? `Last sample: ${formatTime(alert.evidence.last_sample_at)}`
                  : ""}
                {alert.evidence?.restart_delta !== undefined
                  ? `${alert.evidence.restart_delta} restarts`
                  : ""}
                {alert.evidence?.oom_delta !== undefined
                  ? `${alert.evidence.oom_delta} OOM events`
                  : ""}
              </p>
              {alert.acknowledged_at ? (
                <p className="mt-3 text-sm font-semibold">
                  Acknowledged {formatTime(alert.acknowledged_at)}
                </p>
              ) : (
                <AcknowledgeForm id={alert.id} />
              )}
            </div>
          ))}
          {!alerts.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No active alerts. Unconnected sources remain unavailable rather than
              healthy.
            </p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold">Schools</h2>
          {operator.role === "operator" || operator.role === "platform_admin" ? (
            <Link
              href="/admin/schools/new"
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Add school
            </Link>
          ) : (
            <span className="text-sm text-slate-500">
              Open a school for source details
            </span>
          )}
        </div>
        <div className="grid gap-3">
          {rows.map(({ school, status }) => (
            <Link
              key={school.id}
              href={`/admin/schools/${school.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-red-300 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{school.display_name}</h3>
                  <p className="text-sm text-slate-500">
                    {school.slug} · {school.lifecycle_state}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${tone(status?.backend.status || "unknown")}`}
                >
                  Backend {status?.backend.status || "unavailable"}
                </span>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <p>
                  Frontend: <strong>{status?.frontend.status || "unavailable"}</strong>
                </p>
                <p>
                  Last staff login:{" "}
                  <strong>
                    {status?.staff_activity.collection_status === "current"
                      ? status.staff_activity.last_staff_login_at
                        ? formatTime(status.staff_activity.last_staff_login_at)
                        : "No staff login recorded"
                      : "Unavailable"}
                  </strong>
                </p>
                <p>
                  School image:{" "}
                  <strong title={status?.runtime_image?.image_ref || undefined}>
                    <span className="sr-only">
                      {status?.runtime_image?.image_ref || "Unavailable"}
                    </span>
                    <span aria-hidden="true">
                      {compactImageRef(status?.runtime_image?.image_ref)}
                    </span>
                  </strong>
                </p>
              </div>
            </Link>
          ))}
          {!rows.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No schools registered yet.
            </p>
          )}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Shared storage headroom</h2>
        <p className="mt-1 text-sm text-slate-600">
          These readings belong to shared infrastructure and are not assigned to a school.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {shared.sources.map((source) => (
            <div
              key={source.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-bold">{source.resource_ref}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Host collector · {source.revoked_at ? "revoked" : "configured"}
              </p>
              <div className="mt-4 space-y-2">
                {source.metrics.map((metric) => (
                  <p key={metric.metric} className="flex justify-between gap-4 text-sm">
                    <span>{metric.metric.replaceAll("_", " ")}</span>
                    <strong>{formatMetric(metric)}</strong>
                  </p>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Last sample: {formatTime(source.metrics[0]?.observed_at)}
              </p>
            </div>
          ))}
          {!shared.sources.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No shared capacity source connected. Usage is unavailable.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

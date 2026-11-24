import Link from "next/link"
import type { Metadata } from "next"
import { Metrics, Overview, platformRequest } from "@/lib/platform-admin"
import { StatusRefresh } from "./status-refresh"
import { AlertCard } from "./_components/alert-card"
import { NotificationList } from "./_components/notification-row"

export const metadata: Metadata = {
  title: "School operations",
  robots: { index: false, follow: false },
}

const more =
  "text-sm font-semibold text-red-700 underline-offset-4 hover:underline whitespace-nowrap"

/**
 * A short operations dashboard: counts and the few most urgent items, each
 * linking to its full page. Its cost does not grow with the number of schools.
 */
export default async function Page() {
  let overview: Overview
  let shared: Metrics
  try {
    ;[overview, shared] = await Promise.all([
      platformRequest<Overview>("/overview"),
      platformRequest<Metrics>("/metrics/shared"),
    ])
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">School overview</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          School status could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const { schools, alerts, notifications } = overview
  const activeShared = shared.sources.filter((source) => !source.revoked_at)
  const currentShared = activeShared.filter((source) =>
    source.metrics.some((metric) => metric.collection_status === "current")
  ).length
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
          <p className="mt-2 text-3xl font-bold">{schools.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Backend available</p>
          <p className="mt-2 text-3xl font-bold">
            {schools.available}
            <span className="text-base font-normal text-slate-500">
              {" "}
              / {schools.total}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Shared capacity sources</p>
          <p className="mt-2 text-3xl font-bold">
            {currentShared}
            <span className="text-base font-normal text-slate-500">
              {" "}
              / {activeShared.length}
            </span>
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="overview-schools">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="overview-schools" className="text-xl font-bold">
            Schools
          </h2>
          <Link href="/admin/schools" className={more}>
            All schools →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["available", "Available", "border-emerald-200 bg-emerald-50"],
              ["unavailable", "Unavailable", "border-red-200 bg-red-50"],
              ["unknown", "Unknown (no recent check)", "border-slate-200 bg-white"],
            ] as const
          ).map(([status, label, style]) => (
            <Link
              key={status}
              href={`/admin/schools?status=${status}`}
              className={`rounded-2xl border p-5 transition hover:shadow-sm ${style}`}
            >
              <p className="text-sm text-slate-600">{label}</p>
              <p className="mt-1 text-2xl font-bold">{schools[status]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="overview-alerts">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="overview-alerts" className="text-xl font-bold">
            Most urgent alerts
          </h2>
          <span className="flex items-center gap-4 text-sm text-slate-500">
            {alerts.open} open · {alerts.critical} critical · {alerts.unacknowledged} not
            acknowledged
            <Link href="/admin/alerts" className={more}>
              All alerts →
            </Link>
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {alerts.top.map((alert) => (
            <AlertCard key={alert.id} alert={alert} compact />
          ))}
          {!alerts.top.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No active alerts. Unconnected sources remain unavailable rather than
              healthy.
            </p>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="overview-notifications">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="overview-notifications" className="text-xl font-bold">
            Latest notifications
            <span className="ml-2 rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700">
              {notifications.unread} unread
            </span>
          </h2>
          <Link href="/admin/notifications" className={more}>
            All notifications →
          </Link>
        </div>
        <div className="mt-4">
          {notifications.latest.length > 0 && (
            <NotificationList items={notifications.latest} />
          )}
          {!notifications.latest.length && (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No alert notifications yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="overview-storage">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="overview-storage" className="text-xl font-bold">
            Shared storage
          </h2>
          <Link href="/admin/infrastructure" className={more}>
            Infrastructure →
          </Link>
        </div>
        <p className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          {activeShared.length
            ? `${currentShared} of ${activeShared.length} shared source(s) reporting current readings.`
            : "No shared capacity source connected. Usage is unavailable."}
        </p>
      </section>
    </div>
  )
}

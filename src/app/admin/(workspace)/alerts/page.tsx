import Link from "next/link"
import type { Metadata } from "next"
import { CapacityAlert, Overview, platformRequest } from "@/lib/platform-admin"
import { AlertCard } from "../_components/alert-card"
import { Pager } from "../_components/pager"
import { pageNumber, single } from "../_components/status"

export const metadata: Metadata = {
  title: "Alerts",
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 25

/** Every open capacity alert, filtered, with acknowledgement. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const severity = ["warning", "critical"].find((v) => v === single(query.severity))
  const acknowledged = ["yes", "no"].find((v) => v === single(query.acknowledged))
  const schoolText = single(query.school) ?? ""
  const school = /^[a-z0-9-]{1,80}$/.test(schoolText) ? schoolText : undefined
  const page = pageNumber(query.page)
  const filters = { severity, acknowledged, school }
  let alerts: CapacityAlert[]
  let overview: Overview
  try {
    ;[alerts, overview] = await Promise.all([
      platformRequest<CapacityAlert[]>("/alerts", {}, { ...filters, page: String(page) }),
      platformRequest<Overview>("/overview"),
    ])
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Alerts could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const filtered = Boolean(severity || acknowledged || school)
  return (
    <div>
      <h1 className="text-3xl font-bold">Alerts</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {overview.alerts.open} open · {overview.alerts.critical} critical ·{" "}
        {overview.alerts.unacknowledged} not acknowledged. Acknowledgement records who is
        investigating. It does not resolve the condition or change a school.
      </p>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Severity
          <select
            name="severity"
            defaultValue={severity ?? ""}
            className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Acknowledged
          <select
            name="acknowledged"
            defaultValue={acknowledged ?? ""}
            className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Either</option>
            <option value="no">Not yet</option>
            <option value="yes">Acknowledged</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          School slug
          <input
            name="school"
            defaultValue={school ?? ""}
            maxLength={80}
            placeholder="e.g. demo, or shared"
            className="mt-1 block w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </label>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Show
        </button>
        {filtered && (
          <Link
            href="/admin/alerts"
            className="py-2 text-sm font-semibold text-slate-600"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {!alerts.length && (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            {filtered
              ? "No open alerts match."
              : "No active alerts. Unconnected sources remain unavailable rather than healthy."}
          </p>
        )}
      </div>
      <Pager
        path="/admin/alerts"
        page={page}
        hasNext={alerts.length === PAGE_SIZE}
        query={filters}
      />
    </div>
  )
}

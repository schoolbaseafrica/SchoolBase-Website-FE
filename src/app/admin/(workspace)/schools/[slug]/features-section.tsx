import { formatTime, platformRequest, SchoolEntitlements } from "@/lib/platform-admin"
import { FeatureSwitch } from "./feature-switch"

/**
 * The optional features this school has. The school's backend reads this
 * list every few minutes and keeps its last one if the platform is down.
 */
export async function FeaturesSection({
  slug,
  canChange,
}: {
  slug: string
  canChange: boolean
}) {
  let data: SchoolEntitlements
  try {
    data = await platformRequest<SchoolEntitlements>(`/schools/${slug}/entitlements`)
  } catch {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        Features could not be loaded. Please retry.
      </section>
    )
  }
  const fetchedAt = data.last_fetched_at ? new Date(data.last_fetched_at) : null
  const stale = !data.fetch_current
  const on = data.offerings.filter((offering) => offering.enabled).length
  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
      aria-labelledby="features"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="features" className="text-xl font-bold">
          Features
          <span className="ml-2 text-sm font-normal text-slate-500">
            {on} of {data.offerings.length} on
          </span>
        </h2>
        <p
          className={`rounded-full px-3 py-1 text-xs font-semibold ${stale ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}
        >
          {fetchedAt
            ? `School last read its list ${formatTime(fetchedAt.toISOString())}`
            : "School has not read its list yet"}
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Standard features are always on. These optional ones reach the school within about
        two minutes
        {stale
          ? "; this school has not checked in recently, so it is still using its last list"
          : ""}
        .
      </p>
      <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {data.offerings.map((offering) => (
          <li
            key={offering.key}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {offering.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${offering.enabled ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
                >
                  {offering.enabled ? "On" : "Off"}
                </span>
              </p>
              <p className="text-sm text-slate-600">{offering.description}</p>
              {offering.updated_at && (
                <p className="mt-1 text-xs text-slate-500">
                  {offering.reason} · {offering.updated_by ?? "System"},{" "}
                  {formatTime(offering.updated_at)}
                </p>
              )}
            </div>
            {canChange && (
              <FeatureSwitch
                slug={slug}
                offering={offering.key}
                label={offering.label}
                enabled={offering.enabled}
              />
            )}
          </li>
        ))}
      </ul>
      {data.history.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            Recent changes ({data.history.length})
          </summary>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {data.history.map((change, index) => (
              <li key={index}>
                {formatTime(change.occurred_at)} · {change.actor ?? "Unknown"} switched{" "}
                <strong>{change.after_value.offering.replaceAll("_", " ")}</strong>{" "}
                {change.after_value.enabled ? "on" : "off"}: {change.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}

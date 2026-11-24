import type { Metadata } from "next"
import { formatMetric, formatTime, Metrics, platformRequest } from "@/lib/platform-admin"

export const metadata: Metadata = {
  title: "Infrastructure",
  robots: { index: false, follow: false },
}

/** Shared capacity sources: readings that belong to no single school. */
export default async function Page() {
  let shared: Metrics
  try {
    shared = await platformRequest<Metrics>("/metrics/shared")
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">Infrastructure</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Shared readings could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const sources = shared.sources.filter((source) => !source.revoked_at)
  return (
    <div>
      <h1 className="text-3xl font-bold">Infrastructure</h1>
      <h2 className="mt-6 text-xl font-bold">Shared storage headroom</h2>
      <p className="mt-1 text-sm text-slate-600">
        These readings belong to shared infrastructure and are not assigned to a school.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h3 className="font-bold">{source.resource_ref}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Shared capacity source · configured
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
        {!sources.length && (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            No shared capacity source connected. Usage is unavailable.
          </p>
        )}
      </div>
    </div>
  )
}

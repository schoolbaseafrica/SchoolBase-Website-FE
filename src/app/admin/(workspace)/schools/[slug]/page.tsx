import Link from "next/link"
import type { Metadata } from "next"
import {
  formatMetric,
  formatTime,
  MetricHistory,
  Metrics,
  School,
  SchoolStatus,
  platformRequest,
} from "@/lib/platform-admin"
import { Trend } from "./trend"
import { DeploymentForm } from "./deployment-form"

export const metadata: Metadata = {
  title: "School status",
  robots: { index: false, follow: false },
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return <p>School not found.</p>
  let school: School
  let status: SchoolStatus
  let metrics: Metrics
  let history: MetricHistory
  let operator: { role: string }
  try {
    ;[school, status, metrics, history, operator] = await Promise.all([
      platformRequest<School>(`/schools/${slug}`),
      platformRequest<SchoolStatus>(`/schools/${slug}/status`),
      platformRequest<Metrics>(`/schools/${slug}/metrics`),
      platformRequest<MetricHistory>(`/schools/${slug}/metrics/history`),
      platformRequest<{ role: string }>("/operators/me"),
    ])
  } catch {
    return (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
        School details could not be loaded.{" "}
        <Link href="/admin" className="underline">
          Back to overview
        </Link>
      </p>
    )
  }
  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-red-600">
        ← All schools
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-red-600 uppercase">
            School status
          </p>
          <h1 className="mt-2 text-3xl font-bold">{school.display_name}</h1>
          <p className="mt-1 text-slate-600">
            {school.slug} · {school.lifecycle_state}
          </p>
        </div>
        <p className="rounded-full bg-slate-100 px-4 py-2 text-sm break-all">
          {status.deployment.image_tag
            ? `Last recorded image: ${status.deployment.image_tag}`
            : school.image_tag
              ? `Registry image: ${school.image_tag}`
              : "Image: Unavailable"}
        </p>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(
          [
            [
              "Frontend",
              status.frontend.status,
              status.frontend.observed_at,
              status.frontend.source,
            ],
            [
              "Backend",
              status.backend.status,
              status.backend.observed_at,
              status.backend.source,
            ],
            [
              "Staff login",
              status.staff_activity.collection_status === "current"
                ? status.staff_activity.last_staff_login_at
                  ? formatTime(status.staff_activity.last_staff_login_at)
                  : "No staff login recorded"
                : "Unavailable",
              status.staff_activity.last_received_at,
              "school report",
            ],
            [
              "Last deployment",
              status.deployment.state,
              status.deployment.observed_at,
              status.deployment.source,
            ],
          ] as const
        ).map(([label, value, time, source]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm text-slate-500">{label}</h2>
            <p className="mt-2 text-xl font-bold capitalize">{value}</p>
            <p className="mt-3 text-xs text-slate-500">
              Source: {source || "Unavailable"}
              <br />
              Observed: {formatTime(time)}
            </p>
          </div>
        ))}
      </section>
      {status.deployment.source_reference && (
        <p className="mt-3 text-xs break-all text-slate-600">
          Deployment reference: {status.deployment.source_reference}
        </p>
      )}
      {(operator.role === "operator" || operator.role === "platform_admin") && (
        <DeploymentForm slug={school.slug} />
      )}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Capacity by source</h2>
        <p className="mt-1 text-sm text-slate-600">
          Current means recently received, pending live source verification. Stale
          readings are unavailable; charts show historical hourly averages.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {metrics.sources.map((source) => (
            <div
              key={source.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold capitalize">
                  {source.source.replaceAll("_", " ")}
                </h3>
                <span className="text-xs text-slate-500">
                  {source.revoked_at ? "Revoked" : "Configured"}
                </span>
              </div>
              <p className="mt-1 text-xs break-all text-slate-500">
                {source.resource_ref}
              </p>
              <div className="mt-5 space-y-3">
                {source.metrics.map((metric) => (
                  <div key={metric.metric} className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between gap-3 text-sm">
                      <div>
                        <p className="capitalize">{metric.metric.replaceAll("_", " ")}</p>
                        <p className="text-xs text-slate-500">
                          {metric.collection_status} · {formatTime(metric.observed_at)}
                        </p>
                      </div>
                      <strong>{formatMetric(metric)}</strong>
                    </div>
                    <div className="mt-3">
                      <Trend
                        points={history.points.filter(
                          (point) =>
                            point.collector_id === source.id &&
                            point.metric === metric.metric
                        )}
                        label={metric.metric.replaceAll("_", " ")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!metrics.sources.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No capacity collector configured. All capacity signals are unavailable.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

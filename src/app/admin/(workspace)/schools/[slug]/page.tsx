import Link from "next/link"
import type { Metadata } from "next"
import {
  formatMetric,
  formatTime,
  Metrics,
  School,
  SchoolStatus,
  type Signal,
  platformRequest,
} from "@/lib/platform-admin"
import { StatusRefresh } from "../../status-refresh"
import { FeaturesSection } from "./features-section"
import { BillingSection } from "./billing-section"
import { ConnectionSection } from "./connection-section"
import { DetailsForm } from "./details-form"

const PROBLEMS: Record<string, string> = {
  timeout: "No answer within 5 seconds",
  network_error: "Could not connect",
  dns_error: "Address not found (DNS)",
  unsafe_dns: "Address points to a private network",
  invalid_url: "Address not allowed",
  response_too_large: "Unexpected answer",
}

/** Why a check failed, in words, with the address it checked. */
function problem(signal: Signal): string | null {
  if (signal.status === "available" || !signal.source_url) return null
  const why =
    signal.error_code === "not_ready"
      ? signal.http_status === 200
        ? "Answered, but not as a SchoolBase backend"
        : `Answered HTTP ${signal.http_status ?? "?"}`
      : signal.error_code === "http_status"
        ? `Answered HTTP ${signal.http_status ?? "?"}`
        : (PROBLEMS[signal.error_code ?? ""] ?? "Check failed")
  return `${why} at ${signal.source_url}`
}

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
  let operator: { role: string }
  try {
    ;[school, status, metrics, operator] = await Promise.all([
      platformRequest<School>(`/schools/${slug}`),
      platformRequest<SchoolStatus>(`/schools/${slug}/status`),
      platformRequest<Metrics>(`/schools/${slug}/metrics`),
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
  const runtimeImage = status.runtime_image ?? {
    image_ref: null,
    received_at: null,
    collection_status: "unknown",
    source: null,
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
          <p className="mt-1 text-xs break-all text-slate-500">
            Website: {school.frontend_url} · API: {school.api_url}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(operator.role === "operator" || operator.role === "platform_admin") && (
            <DetailsForm key={school.version} school={school} />
          )}
          <StatusRefresh />
        </div>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {(
          [
            [
              "Frontend",
              status.frontend.status,
              status.frontend.observed_at,
              status.frontend.source,
              problem(status.frontend),
            ],
            [
              "Backend",
              status.backend.status,
              status.backend.observed_at,
              status.backend.source,
              problem(status.backend),
            ],
            [
              "Last staff sign-in",
              status.staff_activity.collection_status === "current"
                ? status.staff_activity.last_staff_login_at
                  ? formatTime(status.staff_activity.last_staff_login_at)
                  : "No staff login recorded"
                : "Unavailable",
              status.staff_activity.last_received_at,
              "school report",
              null,
            ],
            [
              "Last staff action",
              status.staff_activity.collection_status === "current"
                ? status.staff_activity.last_staff_action_at
                  ? formatTime(status.staff_activity.last_staff_action_at)
                  : "No action recorded"
                : "Unavailable",
              status.staff_activity.last_received_at,
              "school report",
              null,
            ],
            [
              "School image report",
              runtimeImage.collection_status === "current" ? "Current" : "Unavailable",
              runtimeImage.received_at,
              runtimeImage.source,
              null,
            ],
          ] as const
        ).map(([label, value, time, source, issue]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm text-slate-500">{label}</h2>
            <p className="mt-2 text-xl font-bold capitalize">{value}</p>
            <p className="mt-3 text-xs text-slate-500">
              Source: {source || "Unavailable"}
              <br />
              Observed: {formatTime(time)}
            </p>
            {issue && <p className="mt-2 text-xs break-all text-red-700">{issue}</p>}
          </div>
        ))}
      </section>
      <p className="mt-2 text-xs text-slate-500">
        A staff action is a successful Admin or Teacher create, edit, or delete request.
        Viewing pages does not count.
      </p>
      <p className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
        <span className="font-semibold">Image reported by school:</span>{" "}
        <span className="break-all">{runtimeImage.image_ref || "Unavailable"}</span>
        <span className="mt-2 block text-xs text-slate-500">
          Last received: {formatTime(runtimeImage.received_at)}. Schools report about
          every five minutes.
        </span>
      </p>
      {operator.role === "platform_admin" && (
        <ConnectionSection
          slug={school.slug}
          lastReport={status.staff_activity.last_received_at ?? null}
        />
      )}
      <BillingSection
        slug={school.slug}
        isAdmin={operator.role === "platform_admin"}
        canChange={operator.role === "operator" || operator.role === "platform_admin"}
      />
      <FeaturesSection
        slug={school.slug}
        canChange={operator.role === "operator" || operator.role === "platform_admin"}
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold">School API activity</h2>
        <p className="mt-1 text-sm text-slate-600">
          Completed API requests over a five-minute window. Health checks and preflight
          requests are excluded.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Requests</p>
            <strong className="text-xl">
              {status.api_usage?.request_count ?? "Unavailable"}
            </strong>
          </div>
          <div>
            <p className="text-sm text-slate-500">HTTP 5xx</p>
            <strong className="text-xl">
              {status.api_usage?.error_5xx_count ?? "Unavailable"}
            </strong>
          </div>
          <div>
            <p className="text-sm text-slate-500">p95 response time</p>
            <strong className="text-xl">
              {status.api_usage?.p95_latency_ms == null
                ? "Unavailable"
                : `${status.api_usage.p95_latency_ms} ms or less`}
            </strong>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Source: {status.api_usage?.source || "Unavailable"} · Window ended:{" "}
          {formatTime(status.api_usage?.window_end)} ·{" "}
          {status.api_usage?.collection_status ?? "unknown"}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Capacity by source</h2>
        <p className="mt-1 text-sm text-slate-600">
          Current means recently received, pending live source verification. Stale
          readings are unavailable. Each source shows when its latest reading was
          measured.
        </p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold">School-reported database size</h3>
          <p className="mt-2 text-2xl font-bold">
            {formatMetric({
              metric: "database_bytes",
              value: status.database_size?.database_bytes ?? null,
              observed_at: status.database_size?.reported_at ?? null,
              collection_status: status.database_size?.collection_status ?? "unknown",
            })}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Database: {status.database_size?.database_name || "Unavailable"} · Source:
            school backend · Observed: {formatTime(status.database_size?.reported_at)}
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {metrics.sources
            .filter((source) => !source.revoked_at)
            .map((source) => {
              return (
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
                            <p className="capitalize">
                              {metric.metric.replaceAll("_", " ")}
                            </p>
                            <p className="text-xs text-slate-500">
                              {metric.collection_status} · Last measured:{" "}
                              {formatTime(metric.observed_at)}
                            </p>
                          </div>
                          <strong>{formatMetric(metric)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          {!metrics.sources.some((source) => !source.revoked_at) && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No storage or container readings yet. The collector measures every school
              within the hour
              {school.coolify_resource_ref
                ? "."
                : "; container readings also need this school's Coolify app ID (Edit details)."}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

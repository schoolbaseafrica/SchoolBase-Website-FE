import Link from "next/link"
import type { Metadata } from "next"
import {
  formatMetric,
  formatBytes,
  formatTime,
  Metrics,
  School,
  SchoolStatus,
  platformRequest,
} from "@/lib/platform-admin"
import { StatusRefresh } from "../../status-refresh"
import { StorageAllocationForm } from "./storage-allocation-form"

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
        </div>
        <StatusRefresh />
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
              "School image report",
              runtimeImage.collection_status === "current" ? "Current" : "Unavailable",
              runtimeImage.received_at,
              runtimeImage.source,
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
      <p className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
        <span className="font-semibold">Image reported by school:</span>{" "}
        <span className="break-all">{runtimeImage.image_ref || "Unavailable"}</span>
        <span className="mt-2 block text-xs text-slate-500">
          Last received: {formatTime(runtimeImage.received_at)}. Schools report about
          every five minutes.
        </span>
      </p>
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
          {metrics.sources.map((source) => {
            const usedMetric =
              source.source === "object_store"
                ? source.metrics.find((metric) => metric.metric === "bucket_bytes")
                : undefined
            const used =
              usedMetric?.collection_status === "current" ? usedMetric.value : null
            const allocation =
              school.object_storage_allocation_bytes == null
                ? null
                : Number(school.object_storage_allocation_bytes)
            const remaining =
              used !== null && used !== undefined && allocation !== null
                ? allocation - used
                : null
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
                {source.source === "object_store" && (
                  <div className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-3">
                    <p>
                      <span className="block text-slate-500">Used</span>
                      <strong>{used == null ? "Unavailable" : formatBytes(used)}</strong>
                    </p>
                    <p>
                      <span className="block text-slate-500">Allocated</span>
                      <strong>
                        {allocation === null ? "Not set" : formatBytes(allocation)}
                      </strong>
                    </p>
                    <p>
                      <span className="block text-slate-500">Remaining allocation</span>
                      <strong>
                        {remaining === null
                          ? "Unavailable"
                          : remaining < 0
                            ? `${formatBytes(-remaining)} over`
                            : formatBytes(remaining)}
                      </strong>
                    </p>
                    <p className="text-xs text-slate-500 sm:col-span-3">
                      Allocation is a monitoring target, not an enforced upload limit.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
          {!metrics.sources.length && (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              No infrastructure collector configured. Other capacity signals are
              unavailable.
            </p>
          )}
        </div>
        {operator.role === "platform_admin" && (
          <StorageAllocationForm
            slug={school.slug}
            version={school.version}
            allocationBytes={school.object_storage_allocation_bytes}
          />
        )}
      </section>
    </div>
  )
}

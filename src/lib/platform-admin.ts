import "server-only"
import { cookies } from "next/headers"

export const platformCookie = "sb_platform_session"

export class PlatformRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Platform request failed with status ${status}`)
  }
}

export type School = {
  id: string
  slug: string
  display_name: string
  lifecycle_state: string
  image_tag: string | null
  object_storage_allocation_bytes: string | null
  version: number
}
export type Signal = {
  status: string
  last_result: string | null
  observed_at: string | null
  source: string | null
}
export type SchoolStatus = {
  frontend: Signal
  backend: Signal
  deployment: {
    state: string
    image_tag: string | null
    source: string | null
    source_reference: string | null
    observed_at: string | null
  }
  runtime_image: {
    image_ref: string | null
    reported_at: string | null
    received_at: string | null
    collection_status: "current" | "stale" | "unknown"
    source: string | null
  }
  database_size: {
    database_name: string | null
    database_bytes: number | null
    reported_at: string | null
    received_at: string | null
    collection_status: "current" | "stale" | "unknown"
    source: string | null
  }
  api_usage?: {
    window_start: string | null
    window_end: string | null
    request_count: number | null
    error_5xx_count: number | null
    p95_latency_ms: number | null
    received_at: string | null
    collection_status: "current" | "stale" | "unknown"
    source: string | null
  }
  staff_activity: {
    last_staff_login_at: string | null
    last_staff_action_at: string | null
    last_received_at: string | null
    collection_status: string
  }
}
export type Metric = {
  metric: string
  value: number | null
  observed_at: string | null
  collection_status: string
}
export type MetricSource = {
  id: string
  source: string
  resource_ref: string
  revoked_at: string | null
  metrics: Metric[]
}
export type Metrics = { scope: "school" | "shared"; sources: MetricSource[] }
export type CapacityAlert = {
  id: string
  scope: "school" | "shared"
  school_slug: string | null
  school_name: string | null
  source: string
  resource_ref: string
  condition: string
  severity: "warning" | "critical"
  evidence: {
    window_minutes?: number
    latest_percent?: number
    latest_free_percent?: number
    latest_free_bytes?: number
    last_sample_at?: string | null
    age_ms?: number
    restart_delta?: number
    oom_delta?: number
  }
  opened_at: string
  updated_at: string
  acknowledged_at: string | null
}
/** One alert's notifications, as a single entry. */
export type AlertNotification = {
  alert_id: string
  condition: string
  severity: "warning" | "critical"
  scope: "school" | "shared"
  source: string
  resource_ref: string
  school_slug: string | null
  school_name: string | null
  opened_at: string
  resolved_at: string | null
  latest_kind: "opened" | "escalated" | "resolved"
  latest_at: string
  unread: boolean
}
export type Overview = {
  schools: { total: number; available: number; unavailable: number; unknown: number }
  alerts: { open: number; critical: number; unacknowledged: number; top: CapacityAlert[] }
  notifications: { unread: number; latest: AlertNotification[] }
}
export type SchoolStatusRow = {
  id: string
  slug: string
  display_name: string
  lifecycle_state: string
  backend_status: "available" | "unavailable" | "unknown"
  backend_observed_at: string | null
  frontend_status: "available" | "unavailable" | "unknown"
  last_staff_login_at: string | null
  staff_activity_status: "current" | "stale" | "unknown"
  image_ref: string | null
}
export type SchoolStatusPage = {
  items: SchoolStatusRow[]
  total: number
  page: number
  page_size: number
}
export type SchoolEntitlements = {
  last_fetched_at: string | null
  fetch_current: boolean
  offerings: Array<{
    key: string
    label: string
    description: string
    enabled: boolean
    reason: string | null
    updated_at: string | null
    updated_by: string | null
  }>
  history: Array<{
    occurred_at: string
    reason: string
    actor: string | null
    before_value: { offering: string; enabled: boolean }
    after_value: { offering: string; enabled: boolean }
  }>
}
export type AlertEmailPreference = {
  alert_email_preference: "none" | "critical" | "all"
  email_available: boolean
}
export type MetricHistory = {
  scope: "school" | "shared"
  window_hours: number
  points: {
    collector_id: string
    metric: string
    hour_bucket: string
    sample_count: number
    value_min: number
    value_max: number
    value_avg: number
  }[]
}

function origin() {
  const raw = process.env.PLATFORM_API_ORIGIN
  if (!raw) throw new Error("Platform API is not configured")
  const url = new URL(raw)
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error("Platform API origin must be HTTPS")
  }
  return url.origin
}

export async function platformRequest<T>(
  path: string,
  init: RequestInit = {},
  query: Record<string, string | undefined> = {}
): Promise<T> {
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(path) || path.includes("//"))
    throw new Error("Invalid platform path")
  const token = (await cookies()).get(platformCookie)?.value
  if (!token) throw new Error("Unauthorized")
  // Filters travel as encoded query values, never as part of the path.
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value)
  const search = params.size ? `?${params}` : ""
  const response = await fetch(`${origin()}${path}${search}`, {
    ...init,
    headers: { ...init.headers, authorization: `Bearer ${token}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  })
  if (response.status === 401) throw new Error("Unauthorized")
  if (!response.ok) throw new PlatformRequestError(response.status)
  return response.json() as Promise<T>
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "Unavailable"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Unavailable"
    : date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Lagos",
      })
}

export function formatBytes(value: number) {
  const unit =
    value >= 1024 ** 3 ? "GiB" : value >= 1024 ** 2 ? "MiB" : value >= 1024 ? "KiB" : "B"
  const divisor =
    unit === "GiB" ? 1024 ** 3 : unit === "MiB" ? 1024 ** 2 : unit === "KiB" ? 1024 : 1
  return `${(value / divisor).toLocaleString("en-NG", { maximumFractionDigits: 2 })} ${unit}`
}

export function formatMetric(metric: Metric) {
  if (metric.value === null || metric.collection_status !== "current")
    return "Unavailable"
  if (metric.metric.endsWith("_bytes")) return formatBytes(metric.value)
  if (metric.metric.includes("percent")) return `${metric.value.toFixed(1)}%`
  if (metric.metric.endsWith("_ms")) return `${metric.value.toFixed(0)} ms`
  return metric.value.toLocaleString("en-NG")
}

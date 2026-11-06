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
    observed_at: string | null
  }
  staff_activity: {
    last_staff_login_at: string | null
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
  init: RequestInit = {}
): Promise<T> {
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(path) || path.includes("//"))
    throw new Error("Invalid platform path")
  const token = (await cookies()).get(platformCookie)?.value
  if (!token) throw new Error("Unauthorized")
  const response = await fetch(`${origin()}${path}`, {
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

export function formatMetric(metric: Metric) {
  if (metric.value === null || metric.collection_status !== "current")
    return "Unavailable"
  if (metric.metric.endsWith("_bytes")) {
    return `${(metric.value / 1024 ** 3).toLocaleString("en-NG", { maximumFractionDigits: 2 })} GiB`
  }
  if (metric.metric.includes("percent")) return `${metric.value.toFixed(1)}%`
  if (metric.metric.endsWith("_ms")) return `${metric.value.toFixed(0)} ms`
  return metric.value.toLocaleString("en-NG")
}

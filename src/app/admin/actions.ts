"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  PlatformRequestError,
  platformCookie,
  platformRequest,
  type School,
} from "@/lib/platform-admin"

export async function signIn(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const email = String(form.get("email") || "").trim()
  const password = String(form.get("password") || "")
  const raw = process.env.PLATFORM_API_ORIGIN
  if (!raw) return "Platform API is not configured"
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return "Platform API is not configured"
  }
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    return "Platform API is not configured"
  let response: Response
  try {
    response = await fetch(`${url.origin}/operators/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    return "Platform API is unavailable"
  }
  if (!response.ok)
    return response.status === 401
      ? "Invalid email or password"
      : "Platform API is unavailable"
  const result = (await response.json()) as {
    token?: string
    expires_in_seconds?: number
  }
  if (!result.token || !/^[A-Za-z0-9_-]{40,}$/.test(result.token))
    return "Invalid platform response"
  ;(await cookies()).set(platformCookie, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: Math.min(result.expires_in_seconds || 28800, 28800),
  })
  redirect("/admin")
}

export async function signOut() {
  try {
    await platformRequest("/operators/logout", { method: "POST" })
  } catch {
    /* Clear local session regardless. */
  }
  ;(await cookies()).delete({ name: platformCookie, path: "/admin" })
  redirect("/admin/login")
}

export async function acknowledgeAlert(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const id = String(form.get("id") || "")
  const reason = String(form.get("reason") || "").trim()
  if (!/^[0-9a-f-]{36}$/i.test(id) || !reason || reason.length > 1000)
    return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(`/alerts/${id}/acknowledge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason }),
    })
  } catch {
    return "The alert could not be acknowledged. Reload and try again."
  }
  revalidatePath("/admin", "layout")
  return null
}

/** Mark one alert's notifications read (opening, escalation, resolution). */
export async function markAlertNotificationRead(form: FormData) {
  const id = String(form.get("id") || "")
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  try {
    await platformRequest(`/alerts/${id}/read`, { method: "POST" })
    revalidatePath("/admin", "layout")
  } catch {
    /* The notification remains unread if the request fails. */
  }
}

export async function markAllAlertNotificationsRead() {
  try {
    await platformRequest("/alerts/notifications/read-all", { method: "POST" })
    revalidatePath("/admin", "layout")
  } catch {
    /* Nothing changes if the request fails. */
  }
}

/** Retire a capacity source (for example a test one); platform admins only. */
export async function revokeMetricSource(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const id = String(form.get("id") || "")
  const reason = String(form.get("reason") || "").trim()
  if (!/^[0-9a-f-]{36}$/i.test(id) || !reason || reason.length > 1000)
    return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(`/metric-collectors/${id}/revoke`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason }),
    })
  } catch {
    return "The source could not be revoked. Only a platform admin can revoke one."
  }
  revalidatePath("/admin", "layout")
  return null
}

export async function setAlertEmailPreference(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const preference = String(form.get("preference") || "")
  if (!["none", "critical", "all"].includes(preference))
    return "Choose a valid email preference."
  try {
    await platformRequest("/alerts/email-preference", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preference }),
    })
    revalidatePath("/admin", "layout")
    return "Email preference saved."
  } catch {
    return "Email preference could not be saved. Reload and try again."
  }
}

export async function createPlatformOperator(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase()
  const display_name = String(form.get("display_name") || "").trim()
  const password = String(form.get("password") || "")
  const role = String(form.get("role") || "")
  const reason = String(form.get("reason") || "").trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return "Enter a valid email address."
  if (!display_name || display_name.length > 200) return "Enter a display name."
  if (password.length < 12) return "Use a password of at least 12 characters."
  if (!["viewer", "operator", "platform_admin"].includes(role))
    return "Choose a valid role."
  if (!reason || reason.length > 1000) return "Enter a reason for adding this user."
  try {
    await platformRequest("/operators", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, display_name, password, role, reason }),
    })
    revalidatePath("/admin/operators")
    return "User added. They can now sign in with the password you set."
  } catch (error) {
    if (error instanceof PlatformRequestError && error.status === 409)
      return "An operator with this email already exists."
    if (error instanceof PlatformRequestError && error.status === 403)
      return "Only a Platform admin can add users."
    return "The user could not be added. Check the details and try again."
  }
}

export async function createSchool(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
    .trim()
    .toLowerCase()
  const display_name = String(form.get("display_name") || "").trim()
  const frontend_url = String(form.get("frontend_url") || "").trim()
  const api_url = String(form.get("api_url") || "").trim()
  const lifecycle_state = String(form.get("lifecycle_state") || "onboarding")
  const reason = String(form.get("reason") || "").trim()

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80)
    return "Use a lowercase slug with letters, numbers, and single hyphens."
  if (!display_name || display_name.length > 200 || !reason || reason.length > 1000)
    return "Enter a school name and a reason for registration."
  if (!["onboarding", "active"].includes(lifecycle_state))
    return "Choose a valid school status."
  for (const value of [frontend_url, api_url]) {
    try {
      const url = new URL(value)
      if (
        url.protocol !== "https:" ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        url.username ||
        url.password ||
        url.port
      )
        return "Enter HTTPS origins without paths or ports."
    } catch {
      return "Enter valid HTTPS origins for the website and API."
    }
  }
  if (frontend_url === api_url) return "The website and API URLs must be different."

  let school: School
  try {
    school = await platformRequest<School>("/schools", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slug,
        display_name,
        frontend_url,
        api_url,
        lifecycle_state,
        reason,
      }),
    })
  } catch (error) {
    if (error instanceof PlatformRequestError && error.status === 409)
      return "That school slug or domain is already registered."
    if (error instanceof PlatformRequestError && error.status === 400)
      return "Check the school details and try again."
    if (error instanceof PlatformRequestError && error.status === 403)
      return "Your operator role cannot register schools."
    if (error instanceof Error && error.message === "Unauthorized")
      return "Your session expired. Sign in again."
    return "School registration could not be completed. Try again."
  }
  revalidatePath("/admin", "layout")
  redirect(`/admin/schools/${school.slug}`)
}

export async function updateStorageAllocation(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
  const expected_version = Number(form.get("expected_version"))
  const raw = String(form.get("allocation_gib") || "").trim()
  const reason = String(form.get("reason") || "").trim()
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !Number.isSafeInteger(expected_version) ||
    expected_version < 1
  )
    return "Reload the school page and try again."
  if (!reason || reason.length > 1000) return "Enter a reason for the allocation change."
  let object_storage_allocation_bytes: number | null = null
  if (raw) {
    if (!/^\d+(?:\.\d{1,10})?$/.test(raw))
      return "Enter an amount in GiB with up to ten decimal places."
    object_storage_allocation_bytes = Math.round(Number(raw) * 1024 ** 3)
    if (
      !Number.isSafeInteger(object_storage_allocation_bytes) ||
      object_storage_allocation_bytes <= 0
    )
      return "Enter a positive storage allocation."
  }
  try {
    await platformRequest(`/schools/${slug}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ object_storage_allocation_bytes, expected_version, reason }),
    })
  } catch (error) {
    if (error instanceof PlatformRequestError && error.status === 409)
      return "School settings changed. Reload before editing the allocation."
    if (error instanceof PlatformRequestError && error.status === 403)
      return "Only a Platform administrator can change storage allocation."
    if (error instanceof PlatformRequestError && error.status === 400)
      return "Check the allocation and reason, then try again."
    return "The allocation could not be saved. Try again."
  }
  revalidatePath(`/admin/schools/${slug}`)
  redirect(`/admin/schools/${slug}`)
}

/** Switch one optional feature on or off for one school, with a reason. */
export async function setSchoolEntitlement(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
  const offering = String(form.get("offering") || "")
  const enabled = form.get("enabled") === "true"
  const reason = String(form.get("reason") || "").trim()
  if (!/^[a-z0-9-]{1,80}$/.test(slug) || !/^[a-z_]{2,40}$/.test(offering))
    return "Reload the page and try again."
  if (!reason || reason.length > 1000) return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(`/schools/${slug}/entitlements/${offering}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled, reason }),
    })
  } catch {
    return "The change could not be saved. Reload and try again."
  }
  revalidatePath(`/admin/schools/${slug}`)
  return null
}

const SLUG = /^[a-z0-9-]{1,80}$/
const FEATURE = /^[a-z_]{2,40}$/

/** Automatic (the platform schedule) or Manual enforcement for a school. */
export async function setEnforcementMode(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
  const mode = String(form.get("mode") || "")
  const reason = String(form.get("reason") || "").trim()
  if (!SLUG.test(slug) || (mode !== "automatic" && mode !== "manual"))
    return "Reload the page and try again."
  if (!reason || reason.length > 1000) return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(`/schools/${slug}/billing/enforcement`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode, reason }),
    })
  } catch (error) {
    return error instanceof PlatformRequestError && error.detail
      ? error.detail
      : "The change could not be saved."
  }
  revalidatePath(`/admin/schools/${slug}`)
  return null
}

/** Pause a feature, keep it on, or lift the choice, for an overdue school. */
export async function setEnforcementChoice(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
  const offering = String(form.get("offering") || "")
  const choice = String(form.get("choice") || "")
  const reason = String(form.get("reason") || "").trim()
  if (
    !SLUG.test(slug) ||
    !FEATURE.test(offering) ||
    !["pause", "keep_on", "lift"].includes(choice)
  )
    return "Reload the page and try again."
  if (!reason || reason.length > 1000) return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(
      choice === "lift"
        ? `/schools/${slug}/billing/enforcement/${offering}/lift`
        : `/schools/${slug}/billing/enforcement/${offering}`,
      {
        method: choice === "lift" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(choice === "lift" ? { reason } : { kind: choice, reason }),
      }
    )
  } catch (error) {
    return error instanceof PlatformRequestError && error.detail
      ? error.detail
      : "The change could not be saved."
  }
  revalidatePath(`/admin/schools/${slug}`)
  return null
}

/** Replace the platform schedule (steps sent as JSON from the editor). */
export async function saveBillingSchedule(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const reason = String(form.get("reason") || "").trim()
  let steps: unknown
  try {
    steps = JSON.parse(String(form.get("steps") || "[]"))
  } catch {
    return "Reload the page and try again."
  }
  if (!reason || reason.length > 1000) return "Enter a reason of up to 1,000 characters."
  try {
    await platformRequest(`/billing/schedule`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ steps, reason }),
    })
  } catch (error) {
    return error instanceof PlatformRequestError && error.detail
      ? error.detail
      : "The schedule could not be saved."
  }
  revalidatePath(`/admin/billing`)
  return "saved"
}

/** Naira typed by an operator (e.g. "150,000" or "150000.50") to whole kobo. */
function koboFrom(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").replace(/[,\s₦]/g, "")
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null
  const kobo = Math.round(Number(text) * 100)
  return Number.isSafeInteger(kobo) ? kobo : null
}

async function billingCall(
  path: string,
  body: unknown,
  slug: string
): Promise<string | null> {
  try {
    await platformRequest(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (error) {
    return error instanceof PlatformRequestError && error.status === 400
      ? "The platform refused this. Check the values and try again."
      : error instanceof PlatformRequestError && error.status === 403
        ? "Only a platform admin can change billing."
        : "The change could not be saved. Reload and try again."
  }
  revalidatePath(`/admin/schools/${slug}`)
  revalidatePath("/admin/billing")
  return null
}

const slugOf = (form: FormData) => {
  const slug = String(form.get("slug") || "")
  return /^[a-z0-9-]{1,80}$/.test(slug) ? slug : null
}

export async function setBillingContract(_state: string | null, form: FormData) {
  const slug = slugOf(form)
  const amount = koboFrom(form.get("amount"))
  const cadence = String(form.get("cadence") || "")
  const startsOn = String(form.get("starts_on") || "")
  const reason = String(form.get("reason") || "").trim()
  if (
    !slug ||
    amount === null ||
    !["term", "year"].includes(cadence) ||
    !startsOn ||
    !reason
  )
    return "Fill in the price, period, start date and reason."
  return billingCall(
    `/schools/${slug}/billing/contract`,
    { cadence, amount_kobo: amount, starts_on: startsOn, reason },
    slug
  )
}

export async function addBillingPeriod(_state: string | null, form: FormData) {
  const slug = slugOf(form)
  const label = String(form.get("label") || "").trim()
  const startsOn = String(form.get("starts_on") || "")
  const endsOn = String(form.get("ends_on") || "")
  if (!slug || !label || !startsOn || !endsOn) return "Fill in the name and both dates."
  return billingCall(
    `/schools/${slug}/billing/periods`,
    { label, starts_on: startsOn, ends_on: endsOn, free: form.get("free") === "on" },
    slug
  )
}

export async function issueDueInvoices(_state: string | null, form: FormData) {
  const slug = slugOf(form)
  if (!slug) return "Reload the page and try again."
  return billingCall(`/schools/${slug}/billing/issue`, {}, slug)
}

export async function adjustInvoice(_state: string | null, form: FormData) {
  const slug = slugOf(form)
  const id = String(form.get("id") || "")
  const kind = String(form.get("kind") || "")
  const amount = koboFrom(form.get("amount"))
  const reason = String(form.get("reason") || "").trim()
  if (
    !slug ||
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !["credit", "charge"].includes(kind) ||
    !amount ||
    !reason
  )
    return "Fill in the amount and reason."
  return billingCall(
    `/invoices/${id}/adjustments`,
    { kind, amount_kobo: amount, reason },
    slug
  )
}

export async function voidInvoice(_state: string | null, form: FormData) {
  const slug = slugOf(form)
  const id = String(form.get("id") || "")
  const reason = String(form.get("reason") || "").trim()
  if (!slug || !/^[0-9a-f-]{36}$/i.test(id) || !reason) return "Give a reason."
  return billingCall(`/invoices/${id}/void`, { reason }, slug)
}

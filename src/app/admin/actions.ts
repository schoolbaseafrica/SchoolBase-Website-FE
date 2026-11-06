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
  revalidatePath("/admin")
  return null
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
  revalidatePath("/admin")
  redirect(`/admin/schools/${school.slug}`)
}

export async function recordSchoolDeployment(
  _state: string | null,
  form: FormData
): Promise<string | null> {
  const slug = String(form.get("slug") || "")
  const state = String(form.get("state") || "")
  const image_tag = String(form.get("image_tag") || "").trim()
  const source_reference = String(form.get("source_reference") || "").trim()
  const reason = String(form.get("reason") || "").trim()

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80)
    return "Invalid school. Reload and try again."
  if (!["pending", "running", "succeeded", "failed", "unknown"].includes(state))
    return "Choose the deployment result shown in Coolify."
  if (
    image_tag &&
    (image_tag.length > 500 ||
      !/^ghcr\.io\/[a-z0-9._/-]+(?:@[a-z0-9]+:[a-f0-9]+|:[A-Za-z0-9._-]+)$/.test(
        image_tag
      ))
  )
    return "Enter a full immutable GHCR image tag or digest."
  if (state === "succeeded" && !image_tag)
    return "Enter the image reference used by the successful deployment."
  if (source_reference.length > 200 || !reason || reason.length > 1000)
    return "Enter a reason of up to 1,000 characters and a shorter deployment reference."

  try {
    await platformRequest(`/schools/${slug}/deployments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        state,
        image_tag: image_tag || null,
        source_reference: source_reference || null,
        reason,
      }),
    })
  } catch (error) {
    if (error instanceof PlatformRequestError && error.status === 403)
      return "Your operator role cannot record deployments."
    if (error instanceof Error && error.message === "Unauthorized")
      return "Your session expired. Sign in again."
    return "The deployment observation could not be saved. Try again."
  }
  revalidatePath("/admin")
  revalidatePath(`/admin/schools/${slug}`)
  return null
}

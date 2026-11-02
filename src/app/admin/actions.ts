"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { platformCookie, platformRequest } from "@/lib/platform-admin"

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

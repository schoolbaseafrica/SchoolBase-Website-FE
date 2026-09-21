import { NextResponse } from "next/server"
import { cookies as getCookies } from "next/headers"
import { splitCookiesString } from "set-cookie-parser"

/* Helpers */
const ensureApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiBaseUrl) throw new Error("API_BASE_URL is not configured")
  return apiBaseUrl.replace(/\/+$/, "")
}

const buildBackendUrl = (path: string): string => {
  return `${ensureApiBaseUrl()}/${path.replace(/^\/+/, "")}`
}

const extractAccessTokenFromSetCookie = (
  setCookieHeader: string | null
): string | null => {
  if (!setCookieHeader) return null
  const match = setCookieHeader.match(/access_token=([^;]+)/)
  return match ? match[1] : null
}

/* Forward request */
const forwardRequest = async (
  backendUrl: string,
  method: string,
  body: string | undefined,
  headers: Headers
): Promise<Response> => {
  return fetch(backendUrl, {
    method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  })
}

/* Attempt Refresh Token */
const attemptRefresh = async (): Promise<{
  ok: boolean
  newAccessToken: string | null
  refreshResponse: Response | null
}> => {
  const refreshUrl = buildBackendUrl("auth/refresh")
  const cookieStore = await getCookies()
  const refreshToken = cookieStore.get("refresh_token")?.value

  if (!refreshToken) return { ok: false, newAccessToken: null, refreshResponse: null }

  try {
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: { cookie: `refresh_token=${refreshToken}` },
      cache: "no-store",
    })
    if (!res.ok) return { ok: false, newAccessToken: null, refreshResponse: res }

    const setCookieHeader = res.headers.get("set-cookie")
    const newAccessToken = extractAccessTokenFromSetCookie(setCookieHeader)
    return { ok: true, newAccessToken, refreshResponse: res }
  } catch (err) {
    console.error("[proxy] Token refresh failed", err)
    return { ok: false, newAccessToken: null, refreshResponse: null }
  }
}

/* MAIN PROXY */
export const proxyAuthRequest = async (req: Request, pathname: string) => {
  try {
    const backendUrl = buildBackendUrl(pathname)
    const rawBody = await req.text()

    const headers = new Headers()
    for (const [key, value] of req.headers.entries()) {
      const lower = key.toLowerCase()
      if (
        ["host", "connection", "content-length", "expect"].includes(lower) ||
        value === null
      )
        continue
      headers.set(key, value)
    }

    const cookieStore = await getCookies()
    const accessToken = cookieStore.get("access_token")?.value
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)

    let backendRes = await forwardRequest(
      backendUrl,
      req.method,
      rawBody.length ? rawBody : undefined,
      headers
    )

    if (backendRes.status === 401) {
      const refresh = await attemptRefresh()
      if (refresh.ok && refresh.newAccessToken) {
        headers.set("Authorization", `Bearer ${refresh.newAccessToken}`)
        backendRes = await forwardRequest(
          backendUrl,
          req.method,
          rawBody.length ? rawBody : undefined,
          headers
        )
      }
    }

    const responseText = await backendRes.text()
    const nextRes = new NextResponse(responseText || null, {
      status: backendRes.status,
      headers: {
        "content-type":
          backendRes.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    })

    const setCookieHeader = backendRes.headers.get("set-cookie")
    if (setCookieHeader) {
      const cookies = splitCookiesString(setCookieHeader)
      cookies.forEach((cookie) => {
        nextRes.headers.append("set-cookie", cookie)
      })
    }

    return nextRes
  } catch (err) {
    console.error("[proxy] Proxy error caught:", err)
    return NextResponse.json(
      { message: "Proxy error. Please try again later." },
      { status: 502 }
    )
  }
}

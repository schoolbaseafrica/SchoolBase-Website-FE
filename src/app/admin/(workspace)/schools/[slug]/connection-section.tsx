import { formatTime, platformRequest } from "@/lib/platform-admin"
import { GenerateToken, RevokeToken } from "./connection-forms"

type Credential = {
  id: string
  created_at: string
  revoked_at: string | null
}

/** Where schools send reports: this platform's own address. */
function activityUrl(): string | null {
  try {
    const origin = new URL(process.env.PLATFORM_API_ORIGIN || "")
    if (origin.protocol !== "https:") return null
    return new URL("/school-signals/staff-login", origin).toString()
  } catch {
    return null
  }
}

/**
 * The token a school uses to reach the platform: to report activity and its
 * image, and to read which features it has. Platform admins only.
 */
export async function ConnectionSection({
  slug,
  lastReport,
}: {
  slug: string
  /** When the school last reported, if ever. */
  lastReport: string | null
}) {
  let credentials: Credential[]
  try {
    credentials = await platformRequest<Credential[]>(`/schools/${slug}/credentials`)
  } catch {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        Platform connection could not be loaded. Please retry.
      </section>
    )
  }
  const active = credentials.filter((c) => !c.revoked_at)
  const revoked = credentials.length - active.length
  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
      aria-labelledby="connection"
    >
      <h2 id="connection" className="text-xl font-bold">
        Platform connection
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        The school uses its token to report activity and to receive its features and
        billing.{" "}
        {lastReport
          ? `Last report: ${formatTime(lastReport)}.`
          : "No report received yet."}
      </p>

      {active.length ? (
        <ul className="mt-4 space-y-2">
          {active.map((credential) => (
            <li
              key={credential.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm"
            >
              <span>Active token, created {formatTime(credential.created_at)}</span>
              <RevokeToken slug={slug} id={credential.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm font-semibold text-amber-800">
          No active token. The school cannot reach the platform.
        </p>
      )}
      {revoked > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          {revoked} revoked token{revoked === 1 ? "" : "s"}.
        </p>
      )}

      <GenerateToken
        slug={slug}
        activityUrl={activityUrl()}
        replacing={active.length > 0}
      />
    </section>
  )
}

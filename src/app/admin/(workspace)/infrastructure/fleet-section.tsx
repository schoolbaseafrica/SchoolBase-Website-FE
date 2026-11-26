import { formatTime, platformRequest } from "@/lib/platform-admin"
import { GenerateFleetToken, RevokeFleetToken } from "./fleet-forms"

type FleetToken = { id: string; created_at: string; revoked_at: string | null }

/** Where the collector sends readings: this platform's own address. */
function reportsUrl(): string | null {
  try {
    const origin = new URL(process.env.PLATFORM_API_ORIGIN || "")
    if (origin.protocol !== "https:") return null
    return new URL("/metric-reports", origin).toString()
  } catch {
    return null
  }
}

/**
 * The one token the collector uses to report storage and container readings
 * for every school. Platform admins only.
 */
export async function FleetSection() {
  let tokens: FleetToken[]
  try {
    tokens = await platformRequest<FleetToken[]>("/fleet-collectors")
  } catch {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        Collector token could not be loaded. Please retry.
      </section>
    )
  }
  const active = tokens.filter((token) => !token.revoked_at)
  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
      aria-labelledby="fleet"
    >
      <h2 id="fleet" className="text-xl font-bold">
        School readings collector
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        One token lets the collector measure every school&apos;s storage and container.
        New schools are picked up automatically: storage straight away, containers once
        the school&apos;s Coolify app ID is set.
      </p>
      {active.length ? (
        <ul className="mt-4 space-y-2">
          {active.map((token) => (
            <li
              key={token.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm"
            >
              <span>Active token, created {formatTime(token.created_at)}</span>
              <RevokeFleetToken id={token.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm font-semibold text-amber-800">
          No active token. Schools only have readings from older per-school collectors.
        </p>
      )}
      <GenerateFleetToken platformUrl={reportsUrl()} replacing={active.length > 0} />
    </section>
  )
}

import {
  type Enforcement,
  formatTime,
  platformRequest,
  type SchoolEntitlements,
} from "@/lib/platform-admin"
import { ChoiceButton, ModeSwitch } from "./enforcement-forms"

/**
 * How an overdue school is being made to pay: by pausing features, never by
 * locking it out. Automatic follows the platform schedule; Manual leaves it
 * to operators. In either mode a feature can be paused or kept on.
 */
export async function EnforcementSection({
  slug,
  enforcement,
  canChange,
}: {
  slug: string
  enforcement: Enforcement
  canChange: boolean
}) {
  let features: SchoolEntitlements
  try {
    features = await platformRequest<SchoolEntitlements>(`/schools/${slug}/entitlements`)
  } catch {
    return null
  }
  const overdue = enforcement.days_overdue > 0
  const choice = new Map(
    enforcement.overrides.map((override) => [override.offering, override])
  )
  const groups = features.groups?.length ? features.groups : [null]
  const label = (key: string) =>
    features.offerings.find((o) => o.key === key)?.label ?? key
  return (
    <div
      className="mt-6 rounded-xl border border-slate-200 p-4"
      aria-labelledby="enforcement"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="enforcement" className="font-semibold">
            Enforcement: {enforcement.mode === "automatic" ? "Automatic" : "Manual"}
          </h3>
          <p className="text-sm text-slate-600">
            {enforcement.mode === "automatic"
              ? "The platform schedule pauses features as an invoice stays unpaid."
              : "Nothing pauses unless an operator pauses it."}{" "}
            {overdue
              ? `Oldest unpaid invoice: ${enforcement.days_overdue} day${enforcement.days_overdue === 1 ? "" : "s"} overdue.`
              : "Nothing is overdue."}
          </p>
          {enforcement.mode_reason && (
            <p className="text-xs text-slate-500">
              Mode reason: {enforcement.mode_reason}
            </p>
          )}
          {enforcement.next_step && (
            <p className="mt-1 text-sm text-amber-800">
              In {enforcement.next_step.in_days} day
              {enforcement.next_step.in_days === 1 ? "" : "s"}:{" "}
              {enforcement.next_step.offerings.map(label).join(", ")} pause.
            </p>
          )}
        </div>
        {canChange && (
          <ModeSwitch key={enforcement.mode} slug={slug} mode={enforcement.mode} />
        )}
      </div>

      {overdue &&
        groups.map((group) => {
          const rows = features.offerings.filter(
            (offering) => offering.enabled && (group === null || offering.group === group)
          )
          if (!rows.length) return null
          return (
            <div key={group ?? "all"} className="mt-4">
              {group && (
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {group}
                </h4>
              )}
              <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {rows.map((offering) => {
                  const mine = choice.get(offering.key)
                  const paused = enforcement.paused.includes(offering.key)
                  const bySchedule = enforcement.automatic.includes(offering.key)
                  const state = mine
                    ? mine.kind === "pause"
                      ? `Paused by ${mine.created_by ?? "an operator"}`
                      : `Kept on by ${mine.created_by ?? "an operator"}`
                    : bySchedule
                      ? "Paused by the schedule"
                      : "On"
                  return (
                    <li
                      key={offering.key}
                      className="flex flex-wrap items-center justify-between gap-3 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {offering.label}
                          <span
                            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${paused ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}
                          >
                            {state}
                          </span>
                        </p>
                        {mine && (
                          <p className="text-xs text-slate-500">
                            {mine.reason} · {formatTime(mine.created_at)}
                          </p>
                        )}
                      </div>
                      {canChange && (
                        <div className="flex flex-wrap gap-2">
                          {mine ? (
                            <ChoiceButton
                              key={`lift-${mine.id}`}
                              slug={slug}
                              offering={offering.key}
                              label={offering.label}
                              choice="lift"
                            />
                          ) : paused ? (
                            <ChoiceButton
                              key="keep_on"
                              slug={slug}
                              offering={offering.key}
                              label={offering.label}
                              choice="keep_on"
                            />
                          ) : (
                            <ChoiceButton
                              key="pause"
                              slug={slug}
                              offering={offering.key}
                              label={offering.label}
                              choice="pause"
                            />
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      {overdue && (
        <p className="mt-3 text-xs text-slate-500">
          Only features in this school&apos;s plan are listed. Paying, crediting or
          voiding the overdue invoice lifts every pause and keep-on, on the record.
        </p>
      )}
    </div>
  )
}

"use client"

import { useActionState, useState } from "react"
import { saveBillingSchedule } from "../../actions"
import type { ScheduleStep } from "@/lib/platform-admin"

type Catalogue = {
  groups: string[]
  offerings: Array<{ key: string; label: string; group: string }>
}

/**
 * The one platform schedule: after how many days overdue which features
 * pause, for every school in Automatic mode. Platform admins edit it.
 */
export function ScheduleEditor({
  steps: initial,
  catalogue,
  canEdit,
}: {
  steps: ScheduleStep[]
  catalogue: Catalogue
  canEdit: boolean
}) {
  const [steps, setSteps] = useState<ScheduleStep[]>(initial)
  const [result, action, pending] = useActionState(saveBillingSchedule, null)
  const label = (key: string) =>
    catalogue.offerings.find((o) => o.key === key)?.label ?? key
  const update = (index: number, change: Partial<ScheduleStep>) =>
    setSteps((all) => all.map((step, i) => (i === index ? { ...step, ...change } : step)))
  const toggle = (index: number, key: string) =>
    update(index, {
      offerings: steps[index].offerings.includes(key)
        ? steps[index].offerings.filter((k) => k !== key)
        : [...steps[index].offerings, key],
    })

  if (!canEdit)
    return (
      <ol className="mt-3 space-y-2 text-sm">
        {initial.map((step) => (
          <li key={step.after_days}>
            <strong>After {step.after_days} days overdue:</strong>{" "}
            {step.offerings.map(label).join(", ")}
          </li>
        ))}
      </ol>
    )

  return (
    <form action={action} className="mt-3 space-y-4">
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />
      {steps.map((step, index) => (
        <fieldset key={index} className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Step {index + 1}</legend>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label htmlFor={`days-${index}`}>After</label>
            <input
              id={`days-${index}`}
              type="number"
              min={1}
              max={365}
              value={step.after_days}
              onChange={(event) =>
                update(index, { after_days: Number(event.target.value) })
              }
              className="w-20 rounded-lg border border-slate-300 px-2 py-1"
            />
            <span>days overdue, pause:</span>
            <button
              type="button"
              onClick={() => setSteps((all) => all.filter((_, i) => i !== index))}
              className="ml-auto rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold"
            >
              Remove step
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.groups.map((group) => (
              <div key={group}>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {group}
                </p>
                {catalogue.offerings
                  .filter((offering) => offering.group === group)
                  .map((offering) => (
                    <label
                      key={offering.key}
                      className="mt-1 flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={step.offerings.includes(offering.key)}
                        onChange={() => toggle(index, offering.key)}
                      />
                      {offering.label}
                    </label>
                  ))}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() =>
          setSteps((all) => [
            ...all,
            {
              after_days: Math.max(0, ...all.map((s) => s.after_days)) + 7,
              offerings: [],
            },
          ])
        }
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
      >
        Add step
      </button>
      <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor="schedule-reason">
          Reason for the change
        </label>
        <input
          id="schedule-reason"
          name="reason"
          required
          maxLength={1000}
          placeholder="Reason, for example: firmer schedule agreed for 2027"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save schedule"}
        </button>
        {result === "saved" && (
          <p role="status" className="text-sm text-emerald-700">
            Saved. Schools in Automatic mode follow it within about a minute.
          </p>
        )}
        {result && result !== "saved" && (
          <p role="alert" className="text-sm text-red-700">
            {result}
          </p>
        )}
      </div>
    </form>
  )
}

"use client"

import { useActionState, useState } from "react"
import { setSchoolEntitlement } from "../../../actions"

/** Switch one feature for one school; every change needs a reason. */
export function FeatureSwitch({
  slug,
  offering,
  label,
  enabled,
}: {
  slug: string
  offering: string
  label: string
  enabled: boolean
}) {
  const [error, action, pending] = useActionState(setSchoolEntitlement, null)
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${enabled ? "border border-slate-300 bg-white text-slate-700" : "bg-slate-900 text-white"}`}
      >
        {enabled ? "Switch off" : "Switch on"}
      </button>
    )
  return (
    <form action={action} className="mt-3 w-full space-y-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="offering" value={offering} />
      <input type="hidden" name="enabled" value={String(!enabled)} />
      <p className="text-sm text-slate-700">
        {enabled
          ? `Switching ${label} off hides it from this school and refuses its pages. Its records stay and come back if it is switched on again.`
          : `Switching ${label} on makes it available to this school within about two minutes.`}
      </p>
      <label className="sr-only" htmlFor={`reason-${offering}`}>
        Reason
      </label>
      <input
        id={`reason-${offering}`}
        name="reason"
        required
        maxLength={1000}
        placeholder="Reason, for example: added to the school's plan"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : enabled ? "Switch off" : "Switch on"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}

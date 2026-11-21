"use client"

import { useActionState } from "react"
import { setAlertEmailPreference } from "../actions"

export function AlertEmailPreferenceForm({
  preference,
  available,
}: {
  preference: "none" | "critical" | "all"
  available: boolean
}) {
  const [message, action, pending] = useActionState(setAlertEmailPreference, null)
  return (
    <form action={action} className="flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor="alert-email-preference">Email alerts</label>
      {!available && (
        <span className="text-xs text-amber-700">Delivery pending setup</span>
      )}
      <select
        id="alert-email-preference"
        name="preference"
        defaultValue={preference}
        disabled={pending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2"
      >
        <option value="none">Off</option>
        <option value="critical">Critical only</option>
        <option value="all">All alerts</option>
      </select>
      <button
        disabled={pending}
        className="rounded-full border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {message && (
        <p role="status" className="w-full text-slate-700">
          {message}
        </p>
      )}
    </form>
  )
}

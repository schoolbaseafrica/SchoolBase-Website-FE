"use client"

import { useActionState, useState } from "react"
import { revokeMetricSource } from "../../actions"

/** Retire a source that should no longer report, such as a test one. */
export function RevokeSourceForm({ id, name }: { id: string; name: string }) {
  const [error, action, pending] = useActionState(revokeMetricSource, null)
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
      >
        Revoke source…
      </button>
    )
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-slate-700">
        Revoking stops <strong>{name}</strong> reporting. Its credential stops working and
        it no longer raises alerts. Past readings stay.
      </p>
      <label className="sr-only" htmlFor={`revoke-${id}`}>
        Reason for revoking
      </label>
      <input
        id={`revoke-${id}`}
        name="reason"
        required
        maxLength={1000}
        placeholder="Reason, for example: test source no longer needed"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Revoking…" : "Revoke"}
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

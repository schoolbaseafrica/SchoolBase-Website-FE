"use client"

import { useActionState } from "react"
import { acknowledgeAlert } from "../actions"

export function AcknowledgeForm({ id }: { id: string }) {
  const [error, action, pending] = useActionState(acknowledgeAlert, null)
  return (
    <form action={action} className="mt-4 flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`reason-${id}`}>
        Acknowledgement reason
      </label>
      <input
        id={`reason-${id}`}
        name="reason"
        required
        maxLength={1000}
        placeholder="Reason for acknowledgement"
        className="min-w-48 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        disabled={pending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Acknowledge"}
      </button>
      {error && (
        <p role="alert" className="w-full text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}

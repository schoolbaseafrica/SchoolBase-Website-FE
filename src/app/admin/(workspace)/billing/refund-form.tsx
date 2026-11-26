"use client"

import { useActionState, useState } from "react"
import { markOverpaymentRefunded } from "../../actions"

/** Record that an overpayment has been refunded in Paystack. */
export function RefundForm({ id }: { id: string }) {
  const [error, action, pending] = useActionState(markOverpaymentRefunded, null)
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
      >
        Mark refunded
      </button>
    )
  return (
    <form action={action} className="mt-2 w-full space-y-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`refund-${id}`}>
        Note
      </label>
      <input
        id={`refund-${id}`}
        name="reason"
        required
        maxLength={1000}
        placeholder="Refunded in Paystack on 26 Nov, refund ID …"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Record refund"}
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

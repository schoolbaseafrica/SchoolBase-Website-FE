"use client"

import { useActionState, useState } from "react"
import {
  addBillingPeriod,
  adjustInvoice,
  issueDueInvoices,
  setBillingContract,
  voidInvoice,
} from "../../../actions"

const field = "rounded-lg border border-slate-300 px-3 py-2 text-sm"
const primary =
  "rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
const secondary = "rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold"

function Error({ message }: { message: string | null }) {
  return message ? (
    <p role="alert" className="w-full text-sm text-red-700">
      {message}
    </p>
  ) : null
}

/** Set (or change) the school's price; the previous contract ends on the new start date. */
export function ContractForm({
  slug,
  hasContract,
}: {
  slug: string
  hasContract: boolean
}) {
  const [error, action, pending] = useActionState(setBillingContract, null)
  const [open, setOpen] = useState(!hasContract)
  if (!open)
    return (
      <button type="button" className={secondary} onClick={() => setOpen(true)}>
        Change price
      </button>
    )
  return (
    <form action={action} className="mt-3 flex flex-wrap items-end gap-2">
      <input type="hidden" name="slug" value={slug} />
      <label className="text-sm">
        Price (₦, VAT included)
        <input
          name="amount"
          required
          inputMode="decimal"
          placeholder="150,000"
          className={`${field} mt-1 block w-36`}
        />
      </label>
      <label className="text-sm">
        Per
        <select name="cadence" className={`${field} mt-1 block`}>
          <option value="term">Term</option>
          <option value="year">Year</option>
        </select>
      </label>
      <label className="text-sm">
        From
        <input name="starts_on" type="date" required className={`${field} mt-1 block`} />
      </label>
      <label className="text-sm">
        Reason
        <input
          name="reason"
          required
          maxLength={1000}
          placeholder="Signed contract"
          className={`${field} mt-1 block w-56`}
        />
      </label>
      <button disabled={pending} className={primary}>
        {pending ? "Saving…" : "Save price"}
      </button>
      {hasContract && (
        <button type="button" className={secondary} onClick={() => setOpen(false)}>
          Cancel
        </button>
      )}
      <Error message={error} />
    </form>
  )
}

/** A billing period with its real dates (terms are not equal lengths). */
export function PeriodForm({ slug }: { slug: string }) {
  const [error, action, pending] = useActionState(addBillingPeriod, null)
  return (
    <form action={action} className="mt-3 flex flex-wrap items-end gap-2">
      <input type="hidden" name="slug" value={slug} />
      <label className="text-sm">
        Period
        <input
          name="label"
          required
          maxLength={80}
          placeholder="First term 2026/2027"
          className={`${field} mt-1 block w-52`}
        />
      </label>
      <label className="text-sm">
        Starts
        <input name="starts_on" type="date" required className={`${field} mt-1 block`} />
      </label>
      <label className="text-sm">
        Ends
        <input name="ends_on" type="date" required className={`${field} mt-1 block`} />
      </label>
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input type="checkbox" name="free" /> Free (trial)
      </label>
      <button disabled={pending} className={primary}>
        {pending ? "Adding…" : "Add period"}
      </button>
      <Error message={error} />
    </form>
  )
}

export function IssueButton({ slug }: { slug: string }) {
  const [error, action, pending] = useActionState(issueDueInvoices, null)
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <button disabled={pending} className={secondary}>
        {pending ? "Issuing…" : "Issue due invoices now"}
      </button>
      <Error message={error} />
    </form>
  )
}

/** Credit, charge or void one invoice; each needs a reason. */
export function InvoiceActions({
  slug,
  id,
  canVoid,
}: {
  slug: string
  id: string
  canVoid: boolean
}) {
  const [mode, setMode] = useState<"" | "credit" | "charge" | "void">("")
  const [adjustError, adjust, adjusting] = useActionState(adjustInvoice, null)
  const [voidError, cancel, voiding] = useActionState(voidInvoice, null)
  if (!mode)
    return (
      <div className="flex justify-end gap-1">
        <button type="button" className={secondary} onClick={() => setMode("credit")}>
          Credit
        </button>
        <button type="button" className={secondary} onClick={() => setMode("charge")}>
          Charge
        </button>
        {canVoid && (
          <button type="button" className={secondary} onClick={() => setMode("void")}>
            Void
          </button>
        )}
      </div>
    )
  return (
    <form
      action={mode === "void" ? cancel : adjust}
      className="flex flex-wrap items-end justify-end gap-2"
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="id" value={id} />
      {mode !== "void" && (
        <>
          <input type="hidden" name="kind" value={mode} />
          <input
            name="amount"
            required
            inputMode="decimal"
            placeholder="₦ amount"
            className={`${field} w-28`}
          />
        </>
      )}
      <input
        name="reason"
        required
        maxLength={1000}
        placeholder={
          mode === "credit"
            ? "e.g. paid by transfer"
            : mode === "charge"
              ? "e.g. extra setup"
              : "Why void it"
        }
        className={`${field} w-48`}
      />
      <button disabled={adjusting || voiding} className={primary}>
        {mode === "void" ? "Void" : mode === "credit" ? "Credit" : "Charge"}
      </button>
      <button type="button" className={secondary} onClick={() => setMode("")}>
        Cancel
      </button>
      <Error message={mode === "void" ? voidError : adjustError} />
    </form>
  )
}

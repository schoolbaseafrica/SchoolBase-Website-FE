import { formatTime, naira, platformRequest } from "@/lib/platform-admin"
import { RefundForm } from "./refund-form"

type Overpayment = {
  id: string
  amount_kobo: number
  received_kobo: number
  created_at: string
  refunded_at: string | null
  refund_note: string | null
  invoice_number: string
  school_slug: string
  school_name: string
  reference: string
}

/**
 * Money a school paid beyond what an invoice needed: for example two
 * checkouts for one invoice both paid. Shown until refunded, then for 90 days.
 */
export async function Overpayments({ isAdmin }: { isAdmin: boolean }) {
  const rows = await platformRequest<Overpayment[]>("/billing/overpayments").catch(
    () => null
  )
  if (!rows?.length) return null
  const open = rows.filter((row) => !row.refunded_at)
  return (
    <section
      aria-labelledby="overpayments"
      className={`mt-6 rounded-2xl border p-5 ${open.length ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}
    >
      <h2 id="overpayments" className="text-xl font-bold">
        Payments to refund
      </h2>
      <p className="mt-1 text-sm text-slate-700">
        A school paid more than the invoice needed, usually by paying two checkouts for
        one invoice. Refund the amount in Paystack (find the payment by its reference),
        then record it here.
      </p>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>{naira(row.amount_kobo)}</strong> to refund to {row.school_name} ·
                invoice {row.invoice_number} · paid {formatTime(row.created_at)}
              </span>
              {row.refunded_at ? (
                <span className="text-xs text-slate-600">
                  Refunded {formatTime(row.refunded_at)}
                </span>
              ) : (
                isAdmin && <RefundForm id={row.id} />
              )}
            </div>
            <p className="mt-1 text-xs break-all text-slate-500">
              Paystack reference {row.reference} · received {naira(row.received_kobo)}
              {row.refund_note ? ` · ${row.refund_note}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

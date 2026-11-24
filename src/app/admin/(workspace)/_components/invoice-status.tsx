import type { BillingInvoice } from "@/lib/platform-admin"

const STATUS: Record<BillingInvoice["status"], { label: string; tone: string }> = {
  open: { label: "Due", tone: "bg-blue-50 text-blue-800" },
  overdue: { label: "Overdue", tone: "bg-amber-50 text-amber-800" },
  on_hold: { label: "On hold", tone: "bg-red-50 text-red-800" },
  paid: { label: "Paid", tone: "bg-emerald-50 text-emerald-800" },
  void: { label: "Void", tone: "bg-slate-100 text-slate-600" },
}

export const INVOICE_STATUSES = Object.keys(STATUS) as Array<BillingInvoice["status"]>
export const invoiceStatusLabel = (status: BillingInvoice["status"]) =>
  STATUS[status].label

/** An invoice's status as a small coloured label. */
export function InvoiceStatus({ status }: { status: BillingInvoice["status"] }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[status].tone}`}
    >
      {STATUS[status].label}
    </span>
  )
}

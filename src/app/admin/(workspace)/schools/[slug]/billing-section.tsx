import { naira, platformRequest, SchoolBilling } from "@/lib/platform-admin"
import { InvoiceStatus } from "../../_components/invoice-status"
import { ContractForm, InvoiceActions, IssueButton, PeriodForm } from "./billing-forms"
import { EnforcementSection } from "./enforcement-section"

const date = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

/**
 * What this school pays SchoolBase: its contract, billing periods and
 * invoices. Platform admins change money; other operators view.
 */
export async function BillingSection({
  slug,
  isAdmin,
  canChange,
}: {
  slug: string
  isAdmin: boolean
  /** Operators and platform admins may pause features for non-payment. */
  canChange: boolean
}) {
  let billing: SchoolBilling
  try {
    billing = await platformRequest<SchoolBilling>(`/schools/${slug}/billing`)
  } catch {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        Billing could not be loaded. Please retry.
      </section>
    )
  }
  const contract = billing.contract
  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
      aria-labelledby="billing"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="billing" className="text-xl font-bold">
          Billing
        </h2>
        {billing.on_hold && (
          <p className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">
            Features paused for non-payment
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {contract ? (
            <>
              <strong>{naira(contract.amount_kobo)}</strong> per{" "}
              {contract.cadence === "term" ? "term" : "year"}, VAT included, since{" "}
              {date(contract.starts_on)}
            </>
          ) : (
            "No contract yet."
          )}
        </p>
        {isAdmin && contract && <ContractForm slug={slug} hasContract />}
      </div>
      {isAdmin && !contract && <ContractForm slug={slug} hasContract={false} />}

      {contract && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Periods</h3>
            <IssueButton slug={slug} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Invoices are issued 14 days before a period starts and are due on its first
            day. After 14 days&apos; grace, paid optional features pause until it is paid.
          </p>
          <ul className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 text-sm">
            {billing.periods.map((period) => (
              <li
                key={period.id}
                className="flex flex-wrap justify-between gap-2 px-4 py-2"
              >
                <span>
                  {period.label}
                  {period.free && (
                    <span className="ml-2 text-xs text-emerald-700">free</span>
                  )}
                </span>
                <span className="text-slate-600">
                  {date(period.starts_on)} – {date(period.ends_on)} ·{" "}
                  {period.invoice_number ?? "not invoiced yet"}
                </span>
              </li>
            ))}
            {!billing.periods.length && (
              <li className="px-4 py-2 text-slate-600">No periods yet.</li>
            )}
          </ul>
          {isAdmin && <PeriodForm slug={slug} />}
        </div>
      )}

      {billing.invoices.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <h3 className="font-semibold">Invoices</h3>
          <table className="mt-2 w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600">
              <tr>
                <th className="px-3 py-2">Invoice</th>
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Paid</th>
                <th className="px-3 py-2 text-right">Owed</th>
                <th className="px-3 py-2">Due</th>
                <th className="px-3 py-2">Status</th>
                {isAdmin && <th className="px-3 py-2" />}
              </tr>
            </thead>
            <tbody>
              {billing.invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{invoice.number}</td>
                  <td className="px-3 py-2">{invoice.period_label}</td>
                  <td className="px-3 py-2 text-right">
                    {naira(
                      invoice.total_kobo + invoice.charges_kobo - invoice.credits_kobo
                    )}
                    {(invoice.charges_kobo > 0 || invoice.credits_kobo > 0) && (
                      <span className="block text-xs text-slate-500">
                        {naira(invoice.total_kobo)}
                        {invoice.charges_kobo > 0 && ` + ${naira(invoice.charges_kobo)}`}
                        {invoice.credits_kobo > 0 && ` − ${naira(invoice.credits_kobo)}`}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">{naira(invoice.paid_kobo)}</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {naira(Math.max(0, invoice.outstanding_kobo))}
                  </td>
                  <td className="px-3 py-2">{date(invoice.due_on)}</td>
                  <td className="px-3 py-2">
                    <InvoiceStatus status={invoice.status} />
                    {invoice.void_reason && (
                      <span className="block text-xs text-slate-500">
                        {invoice.void_reason}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-3 py-2">
                      {invoice.status !== "void" && (
                        <InvoiceActions
                          // A saved change re-renders with new amounts, closing the form.
                          key={`${invoice.id}-${invoice.outstanding_kobo}-${invoice.status}`}
                          slug={slug}
                          id={invoice.id}
                          canVoid={invoice.paid_kobo === 0}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {billing.enforcement && (
        <EnforcementSection
          slug={slug}
          enforcement={billing.enforcement}
          canChange={canChange}
        />
      )}
    </section>
  )
}

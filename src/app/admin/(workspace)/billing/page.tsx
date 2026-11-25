import Link from "next/link"
import type { Metadata } from "next"
import {
  BillingInvoicePage,
  naira,
  platformRequest,
  type ScheduleStep,
} from "@/lib/platform-admin"
import { ScheduleEditor } from "./schedule-editor"
import {
  InvoiceStatus,
  INVOICE_STATUSES,
  invoiceStatusLabel,
} from "../_components/invoice-status"
import { Pager } from "../_components/pager"
import { pageNumber, single } from "../_components/status"

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
}

/** Every school's SchoolBase invoices, by status. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const status = INVOICE_STATUSES.find((value) => value === single(query.status))
  const page = pageNumber(query.page)
  let result: BillingInvoicePage
  try {
    result = await platformRequest<BillingInvoicePage>(
      "/billing/invoices",
      {},
      { status, page: String(page) }
    )
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Invoices could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  // The enforcement schedule is shown below the invoices; it is optional to
  // the page, so a failure to load it does not hide the invoices.
  const [schedule, me] = await Promise.all([
    platformRequest<{
      steps: ScheduleStep[]
      groups: string[]
      offerings: Array<{ key: string; label: string; group: string }>
    }>("/billing/schedule").catch(() => null),
    platformRequest<{ role: string }>("/operators/me").catch(() => null),
  ])
  const lastPage = Math.max(1, Math.ceil(result.total / result.page_size))
  const tab = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`
  return (
    <div>
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        What schools owe SchoolBase. Open a school to set its price, periods and adjust
        invoices.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/billing" className={tab(!status)}>
          All
        </Link>
        {INVOICE_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/billing?status=${value}`}
            className={tab(status === value)}
          >
            {invoiceStatusLabel(value)} ({result.counts[value]})
          </Link>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-4 py-2">Invoice</th>
              <th className="px-4 py-2">School</th>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2 text-right">Owed</th>
              <th className="px-4 py-2">Due</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="px-4 py-2 font-medium">{invoice.number}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/schools/${invoice.school_slug}`}
                    className="font-semibold text-red-700 hover:underline"
                  >
                    {invoice.school_name}
                  </Link>
                </td>
                <td className="px-4 py-2">{invoice.period_label}</td>
                <td className="px-4 py-2 text-right font-semibold">
                  {naira(Math.max(0, invoice.outstanding_kobo))}
                </td>
                <td className="px-4 py-2">{invoice.due_on}</td>
                <td className="px-4 py-2">
                  <InvoiceStatus status={invoice.status} />
                </td>
              </tr>
            ))}
            {!result.items.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-slate-600">
                  No invoices{status ? " with this status" : " yet"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pager
        path="/admin/billing"
        page={page}
        hasNext={page < lastPage}
        query={{ status }}
        label={`Page ${Math.min(page, lastPage)} of ${lastPage}`}
      />
      {schedule && (
        <section
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-5"
          aria-labelledby="schedule"
        >
          <h2 id="schedule" className="text-xl font-bold">
            Enforcement schedule
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            For schools in Automatic mode: as an invoice stays unpaid, these features
            pause. Schools keep signing in, and paying restores everything. Operators can
            still pause a feature or keep one on for a school, and switch a school to
            Manual.
          </p>
          <ScheduleEditor
            steps={schedule.steps}
            catalogue={{ groups: schedule.groups, offerings: schedule.offerings }}
            canEdit={me?.role === "platform_admin"}
          />
        </section>
      )}
    </div>
  )
}

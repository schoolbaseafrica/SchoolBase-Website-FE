import Link from "next/link"
import type { Metadata } from "next"
import {
  AlertEmailPreference,
  AlertNotification,
  Overview,
  platformRequest,
} from "@/lib/platform-admin"
import { AlertEmailPreferenceForm } from "../alert-email-preference-form"
import { NotificationRow } from "../_components/notification-row"
import { Pager } from "../_components/pager"
import { pageNumber, single } from "../_components/status"

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 25

/** Alert notification history and this operator's email preference. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const unread = single(query.unread) === "true" ? "true" : undefined
  const page = pageNumber(query.page)
  let items: AlertNotification[]
  let overview: Overview
  let emailPreference: AlertEmailPreference
  try {
    ;[items, overview, emailPreference] = await Promise.all([
      platformRequest<AlertNotification[]>(
        "/alerts/notifications",
        {},
        { unread, page: String(page) }
      ),
      platformRequest<Overview>("/overview"),
      platformRequest<AlertEmailPreference>("/alerts/email-preference"),
    ])
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Notifications could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const tab = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Notifications
        <span className="ml-3 rounded-full bg-red-50 px-2.5 py-1 align-middle text-xs text-red-700">
          {overview.notifications.unread} unread
        </span>
      </h1>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">Email</h2>
          <AlertEmailPreferenceForm
            preference={emailPreference.alert_email_preference}
            available={emailPreference.email_available}
          />
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Alerts appear here by default.{" "}
          {emailPreference.email_available
            ? "Email is optional and uses your operator email address."
            : "You can save an email preference now. Delivery starts after MAIL_HOST and MAIL_FROM_ADDRESS are configured on the Platform API in Coolify and alerts are enabled."}
        </p>
      </section>

      <div className="mt-6 flex gap-2">
        <Link href="/admin/notifications" className={tab(!unread)}>
          All
        </Link>
        <Link href="/admin/notifications?unread=true" className={tab(Boolean(unread))}>
          Unread
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
        {!items.length && (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            {unread ? "Nothing unread." : "No alert notifications yet."}
          </p>
        )}
      </div>
      <Pager
        path="/admin/notifications"
        page={page}
        hasNext={items.length === PAGE_SIZE}
        query={{ unread }}
      />
    </div>
  )
}

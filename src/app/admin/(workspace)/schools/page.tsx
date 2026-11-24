import Link from "next/link"
import type { Metadata } from "next"
import { formatTime, platformRequest, SchoolStatusPage } from "@/lib/platform-admin"
import { Pager } from "../_components/pager"
import { compactImageRef, pageNumber, single, tone } from "../_components/status"

export const metadata: Metadata = {
  title: "Schools",
  robots: { index: false, follow: false },
}

const STATUSES = ["available", "unavailable", "unknown"] as const

/** Every registered school, searchable and filterable by availability. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const search = (single(query.search) ?? "").slice(0, 100)
  const requested = single(query.status)
  const status = STATUSES.find((value) => value === requested)
  const page = pageNumber(query.page)
  let operator: { role: string }
  let result: SchoolStatusPage
  try {
    ;[operator, result] = await Promise.all([
      platformRequest<{ role: string }>("/operators/me"),
      platformRequest<SchoolStatusPage>(
        "/school-statuses",
        {},
        { search: search || undefined, status, page: String(page) }
      ),
    ])
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-bold">Schools</h1>
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Schools could not be loaded. Please retry.
        </p>
      </section>
    )
  }
  const lastPage = Math.max(1, Math.ceil(result.total / result.page_size))
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Schools</h1>
        {(operator.role === "operator" || operator.role === "platform_admin") && (
          <Link
            href="/admin/schools/new"
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Add school
          </Link>
        )}
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">
        Backend status comes from the latest availability check; with no check in the last
        five minutes it is unknown. Open a school for its full readings.
      </p>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Search
          <input
            name="search"
            defaultValue={search}
            maxLength={100}
            placeholder="School name or slug"
            className="mt-1 block w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          Backend
          <select
            name="status"
            defaultValue={status ?? ""}
            className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Any status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Show
        </button>
        {(search || status) && (
          <Link
            href="/admin/schools"
            className="py-2 text-sm font-semibold text-slate-600"
          >
            Clear
          </Link>
        )}
      </form>

      <p className="mt-4 text-sm text-slate-500">
        {result.total} school{result.total === 1 ? "" : "s"}
        {search || status ? " match" : ""}
      </p>
      <div className="mt-3 grid gap-3">
        {result.items.map((school) => (
          <Link
            key={school.id}
            href={`/admin/schools/${school.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-red-300 hover:shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{school.display_name}</h2>
                <p className="text-sm text-slate-500">
                  {school.slug} · {school.lifecycle_state}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${tone(school.backend_status)}`}
              >
                Backend {school.backend_status}
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <p>
                Frontend: <strong>{school.frontend_status}</strong>
              </p>
              <p>
                Last staff sign-in:{" "}
                <strong>
                  {school.staff_activity_status === "current"
                    ? school.last_staff_login_at
                      ? formatTime(school.last_staff_login_at)
                      : "No staff login recorded"
                    : "Unavailable"}
                </strong>
              </p>
              <p>
                School image:{" "}
                <strong title={school.image_ref || undefined}>
                  <span className="sr-only">{school.image_ref || "Unavailable"}</span>
                  <span aria-hidden="true">{compactImageRef(school.image_ref)}</span>
                </strong>
              </p>
            </div>
          </Link>
        ))}
        {!result.items.length && (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            {search || status ? "No schools match." : "No schools registered yet."}
          </p>
        )}
      </div>
      <Pager
        path="/admin/schools"
        page={page}
        hasNext={page < lastPage}
        query={{ search: search || undefined, status }}
        label={`Page ${Math.min(page, lastPage)} of ${lastPage}`}
      />
    </div>
  )
}

import Link from "next/link"

/**
 * Previous and next page links that keep the current filters. `hasNext` is
 * known from a total when the list has one, otherwise from a full page.
 */
export function Pager({
  path,
  page,
  hasNext,
  query,
  label,
}: {
  path: string
  page: number
  hasNext: boolean
  query: Record<string, string | undefined>
  label?: string
}) {
  if (page === 1 && !hasNext) return null
  const href = (target: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) if (value) params.set(key, value)
    if (target > 1) params.set("page", String(target))
    return params.size ? `${path}?${params}` : path
  }
  const link =
    "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-red-300"
  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={href(page - 1)} className={link}>
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-slate-500">{label ?? `Page ${page}`}</span>
      {hasNext ? (
        <Link href={href(page + 1)} className={link}>
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

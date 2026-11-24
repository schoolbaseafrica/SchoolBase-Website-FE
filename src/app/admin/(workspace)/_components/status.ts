/** Badge colours for a status: green when good, red when down, grey otherwise. */
export function tone(status: string) {
  if (status === "available" || status === "current")
    return "bg-emerald-50 text-emerald-800"
  if (status === "unavailable" || status === "failed") return "bg-red-50 text-red-800"
  return "bg-slate-100 text-slate-600"
}

/** A short form of an image reference that still tells builds apart. */
export function compactImageRef(ref: string | null | undefined) {
  if (!ref) return "Unavailable"
  const combined = /:fe-([a-f0-9]{8,})-be-([a-f0-9]{8,})$/.exec(ref)
  if (combined) return `fe-${combined[1].slice(0, 7)}…be-${combined[2].slice(0, 7)}`
  const digest = /@sha256:([a-f0-9]{64})$/.exec(ref)
  if (digest) return `sha256:${digest[1].slice(0, 8)}…${digest[1].slice(-8)}`
  return ref.length > 28 ? `${ref.slice(0, 14)}…${ref.slice(-10)}` : ref
}

/** One query-string value, ignoring repeats. */
export function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

/** A positive page number from the query string, 1 otherwise. */
export function pageNumber(value: string | string[] | undefined) {
  const page = Number(single(value))
  return Number.isInteger(page) && page > 0 && page < 100000 ? page : 1
}

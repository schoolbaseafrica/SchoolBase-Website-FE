import { MetricHistory } from "@/lib/platform-admin"

export function Trend({
  points,
  label,
}: {
  points: MetricHistory["points"]
  label: string
}) {
  const ordered = [...points].sort((a, b) => a.hour_bucket.localeCompare(b.hour_bucket))
  if (ordered.length < 2)
    return (
      <p className="text-xs text-slate-500">
        Trend unavailable: fewer than two hourly readings.
      </p>
    )
  const values = ordered.map((point) => Number(point.value_avg))
  if (values.some((value) => !Number.isFinite(value)))
    return <p className="text-xs text-slate-500">Trend unavailable.</p>
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const first = new Date(ordered[0].hour_bucket).getTime()
  const last = new Date(ordered[ordered.length - 1].hour_bucket).getTime()
  if (!Number.isFinite(first) || !Number.isFinite(last) || first === last)
    return <p className="text-xs text-slate-500">Trend unavailable.</p>
  const path = ordered
    .map((point, index) => {
      const x = ((new Date(point.hour_bucket).getTime() - first) / (last - first)) * 300
      const y =
        maximum === minimum
          ? 36
          : 64 - ((values[index] - minimum) / (maximum - minimum)) * 56
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <div>
      <svg
        role="img"
        aria-label={`${label}: ${ordered.length} hourly readings over seven days`}
        viewBox="0 0 300 72"
        className="h-20 w-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-xs text-slate-500">
        {ordered.length} hourly readings ·{" "}
        {new Date(ordered[0].hour_bucket).toLocaleDateString("en-NG")} to{" "}
        {new Date(ordered[ordered.length - 1].hour_bucket).toLocaleDateString("en-NG")}
      </p>
    </div>
  )
}

/** Plain words for alert conditions and metric sources, shown to operators. */
const CONDITIONS: Record<string, string> = {
  collection_stale: "Readings stopped",
  cpu_pressure: "High CPU use",
  memory_pressure: "High memory use",
  oom: "Ran out of memory",
  restarts: "Repeated restarts",
  disk_headroom: "Low disk space",
}

const SOURCES: Record<string, string> = {
  container: "app container",
  proxy: "web proxy",
  database: "database",
  object_store: "file storage",
  host: "server disk",
}

export function conditionLabel(condition: string) {
  return CONDITIONS[condition] ?? condition.replaceAll("_", " ")
}

export function sourceLabel(source: string | null | undefined) {
  return (source && SOURCES[source]) ?? "readings"
}

/** "5 min", "2 h 10 min", "3 days" between two times. */
export function duration(from: string, to: string) {
  const minutes = Math.max(
    1,
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000)
  )
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return minutes % 60 ? `${hours} h ${minutes % 60} min` : `${hours} h`
  return `${Math.round(hours / 24)} days`
}

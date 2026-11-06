"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

export function StatusRefresh() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
    >
      {pending ? "Refreshing…" : "Refresh status"}
    </button>
  )
}

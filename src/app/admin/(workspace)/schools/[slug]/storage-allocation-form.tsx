"use client"

import { useActionState } from "react"
import { updateStorageAllocation } from "@/app/admin/actions"

export function StorageAllocationForm({
  slug,
  version,
  allocationBytes,
}: {
  slug: string
  version: number
  allocationBytes: string | null
}) {
  const [error, action, pending] = useActionState(updateStorageAllocation, null)
  const gib =
    allocationBytes === null
      ? ""
      : (Number(allocationBytes) / 1024 ** 3)
          .toFixed(10)
          .replace(/0+$/, "")
          .replace(/\.$/, "")

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h3 className="font-bold">School object storage allocation</h3>
      <p className="mt-1 text-sm text-slate-600">
        Set the school&apos;s monitoring target in GiB. Leave blank to remove it. This
        setting does not enforce a MinIO bucket quota.
      </p>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="expected_version" value={version} />
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,12rem)_1fr_auto] sm:items-end">
        <label className="text-sm font-semibold">
          Allocated storage (GiB)
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            name="allocation_gib"
            type="number"
            min="0.000000001"
            step="any"
            defaultValue={gib}
            placeholder="For example, 5"
          />
        </label>
        <label className="text-sm font-semibold">
          Reason for change
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            name="reason"
            required
            maxLength={1000}
            placeholder="For example, pilot storage allocation"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save allocation"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}

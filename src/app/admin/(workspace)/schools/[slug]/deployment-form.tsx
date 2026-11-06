"use client"

import { useActionState, useState } from "react"
import { recordSchoolDeployment } from "@/app/admin/actions"

const inputClass =
  "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-red-500"

export function DeploymentForm({ slug }: { slug: string }) {
  const [error, action, pending] = useActionState(recordSchoolDeployment, null)
  const [state, setState] = useState("succeeded")

  return (
    <form
      action={action}
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="text-lg font-bold">Record a Coolify deployment</h2>
      <p className="mt-1 text-sm text-slate-600">
        Check Coolify first. This is an operator observation, recorded at submission time;
        it does not sync deployment status automatically.
      </p>
      <input type="hidden" name="slug" value={slug} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Deployment result
          <select
            className={inputClass}
            name="state"
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            <option value="succeeded">Succeeded (Coolify: Finished)</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Image reference {state === "succeeded" ? "(required)" : "(optional)"}
          <input
            className={inputClass}
            name="image_tag"
            required={state === "succeeded"}
            maxLength={500}
            placeholder="ghcr.io/donkross360/schoolbase:fe-…-be-…"
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Coolify deployment reference (optional)
          <input
            className={inputClass}
            name="source_reference"
            maxLength={200}
            placeholder="Deployment UUID or Coolify reference"
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Reason or evidence
          <textarea
            className={inputClass}
            name="reason"
            required
            maxLength={1000}
            rows={2}
            placeholder="Checked the latest Demo deployment in Coolify"
          />
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Recording…" : "Record observation"}
      </button>
    </form>
  )
}

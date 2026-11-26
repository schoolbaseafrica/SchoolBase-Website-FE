"use client"

import { useActionState, useState } from "react"
import { createFleetToken, revokeFleetToken } from "../../actions"

function CopyRow({ text, value }: { text: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="min-w-0 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs break-all">
        {text}
      </code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch {
            setCopied(false)
          }
        }}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}

/** Generate the collector token, shown once with what the collector app needs. */
export function GenerateFleetToken({
  platformUrl,
  replacing,
}: {
  platformUrl: string | null
  replacing: boolean
}) {
  const [state, action, pending] = useActionState(createFleetToken, {
    error: null,
    token: null,
  })
  const [open, setOpen] = useState(false)

  if (state.token)
    return (
      <div className="mt-4 space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Copy the token now. It is shown only once and cannot be viewed again.
        </p>
        <p className="text-sm text-slate-700">
          1. In Coolify, open the private <strong>Platform Collector</strong> app and set
          these environment variables (mark the token as a secret), then redeploy it:
        </p>
        <CopyRow text={`METRICS_FLEET_TOKEN=${state.token}`} value={state.token} />
        {platformUrl && (
          <CopyRow text={`METRICS_PLATFORM_URL=${platformUrl}`} value={platformUrl} />
        )}
        <p className="text-sm text-slate-700">
          2. In the same app, add two Scheduled Tasks, then use Execute Now on each:
        </p>
        <CopyRow
          text="School storage · hourly (27 * * * *) · node scripts/collect-fleet.js buckets"
          value="node scripts/collect-fleet.js buckets"
        />
        <CopyRow
          text="School containers · every minute (* * * * *) · node scripts/collect-fleet.js containers"
          value="node scripts/collect-fleet.js containers"
        />
        <p className="text-xs text-slate-600">
          Each run lists every school with its result. A school without a Coolify app ID
          is skipped for containers until one is set under Edit details on its page. The
          old per-school storage and container tasks stop working once the new ones report
          for the same school; delete them then. Keep the shared MinIO capacity task.
          {replacing && " After the new token works, revoke the old one below."}
        </p>
      </div>
    )

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        {replacing ? "Generate a replacement token" : "Generate collector token"}
      </button>
    )

  return (
    <form action={action} className="mt-4 w-full space-y-2">
      <label className="block text-sm text-slate-700" htmlFor="fleet-reason">
        Reason
      </label>
      <input
        id="fleet-reason"
        name="reason"
        required
        maxLength={1000}
        placeholder="Collect readings for every school"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Generating…" : "Generate"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  )
}

/** Stop a collector token working. */
export function RevokeFleetToken({ id }: { id: string }) {
  const [error, action, pending] = useActionState(revokeFleetToken, null)
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
      >
        Revoke
      </button>
    )
  return (
    <form action={action} className="mt-2 w-full space-y-2">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-slate-700">
        The collector stops reporting for every school until it has a new token.
      </p>
      <label className="sr-only" htmlFor={`revoke-fleet-${id}`}>
        Reason
      </label>
      <input
        id={`revoke-fleet-${id}`}
        name="reason"
        required
        maxLength={1000}
        placeholder="Replaced by a new token"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Revoking…" : "Revoke token"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}

"use client"

import { useActionState, useState } from "react"
import { createSchoolToken, revokeSchoolToken } from "../../../actions"

function CopyRow({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="min-w-0 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs break-all">
        {name}={value}
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
        aria-label={`Copy ${name}`}
      >
        {copied ? "Copied" : "Copy value"}
      </button>
    </div>
  )
}

/**
 * Generate a school token. It is shown once, with the other settings the
 * school's Coolify app needs, because the platform keeps only its hash.
 */
export function GenerateToken({
  slug,
  activityUrl,
  replacing,
}: {
  slug: string
  activityUrl: string | null
  /** The school already has an active token. */
  replacing: boolean
}) {
  const [state, action, pending] = useActionState(createSchoolToken, {
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
          In Coolify, open the school&apos;s app, set these environment variables, then
          redeploy it:
        </p>
        <CopyRow name="PLATFORM_SCHOOL_TOKEN" value={state.token} />
        {activityUrl && <CopyRow name="PLATFORM_ACTIVITY_URL" value={activityUrl} />}
        <CopyRow name="APP_SLUG" value={slug} />
        <p className="text-xs text-slate-600">
          Mark the token as a secret. Within five minutes of the redeploy, this page shows
          the school&apos;s first report.
          {replacing &&
            " Once it does, revoke the old token below so only the new one works."}
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
        {replacing ? "Generate a replacement token" : "Generate token"}
      </button>
    )

  return (
    <form action={action} className="mt-4 w-full space-y-2">
      <input type="hidden" name="slug" value={slug} />
      <label className="block text-sm text-slate-700" htmlFor="token-reason">
        Reason
      </label>
      <input
        id="token-reason"
        name="reason"
        required
        maxLength={1000}
        placeholder={replacing ? "Replace lost token" : "Connect school to platform"}
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

/** Stop one token working. The school stops reporting until it has a new one. */
export function RevokeToken({ slug, id }: { slug: string; id: string }) {
  const [error, action, pending] = useActionState(revokeSchoolToken, null)
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
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-slate-700">
        A school using this token stops reporting and falls back to its last known
        features until it gets a new token.
      </p>
      <label className="sr-only" htmlFor={`revoke-${id}`}>
        Reason
      </label>
      <input
        id={`revoke-${id}`}
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

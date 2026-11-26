"use client"

import { startTransition, useActionState, useState } from "react"
import { updateSchoolDetails } from "../../../actions"

type Details = {
  slug: string
  version: number
  display_name: string
  frontend_url: string
  api_url: string
  support_email: string | null
  coolify_resource_ref: string | null
  lifecycle_state: string
}

const STATES: Array<[string, string, string]> = [
  ["onboarding", "Onboarding", "Being set up; not yet in use."],
  ["active", "Active", "In use by the school."],
  ["suspended", "Suspended", "A label only: the school keeps running and reporting."],
  [
    "retired",
    "Retired",
    "Probes and readings stop, and the school's token stops working. It can be undone.",
  ],
]

const field = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"

/** The school's registered name, addresses, support email, Coolify app and state. */
export function DetailsForm({ school }: { school: Details }) {
  const [error, action, pending] = useActionState(updateSchoolDetails, null)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState(school.lifecycle_state)

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
      >
        Edit details
      </button>
    )

  const hint = STATES.find(([value]) => value === state)?.[2]
  return (
    <form
      // Submitted by hand so a refused save keeps what was typed; a form
      // action would reset every field.
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        startTransition(() => action(data))
      }}
      className="mt-4 grid w-full gap-3 sm:grid-cols-2"
    >
      <input type="hidden" name="slug" value={school.slug} />
      <input type="hidden" name="version" value={school.version} />
      {(
        [
          "display_name",
          "frontend_url",
          "api_url",
          "support_email",
          "coolify_resource_ref",
          "lifecycle_state",
        ] as const
      ).map((name) => (
        <input key={name} type="hidden" name={`was_${name}`} value={school[name] ?? ""} />
      ))}
      <label className="text-sm">
        <span className="mb-1 block font-medium">School name</span>
        <input
          name="display_name"
          required
          maxLength={200}
          defaultValue={school.display_name}
          className={field}
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">State</span>
        <select
          name="lifecycle_state"
          value={state}
          onChange={(event) => setState(event.target.value)}
          className={field}
        >
          {STATES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Website address</span>
        <input
          name="frontend_url"
          type="url"
          required
          defaultValue={school.frontend_url}
          placeholder="https://school.example.com"
          className={field}
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">API address</span>
        <input
          name="api_url"
          type="url"
          required
          defaultValue={school.api_url}
          placeholder="https://api.school.example.com"
          className={field}
        />
        <span className="mt-1 block text-xs text-slate-500">
          The backend is checked at this address + /api/v1/health/ready.
        </span>
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Support email (optional)</span>
        <input
          name="support_email"
          type="email"
          defaultValue={school.support_email ?? ""}
          className={field}
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Coolify app ID</span>
        <input
          name="coolify_resource_ref"
          defaultValue={school.coolify_resource_ref ?? ""}
          placeholder="24 lowercase letters and numbers"
          pattern="[a-z0-9]{20,40}"
          className={field}
        />
        <span className="mt-1 block text-xs text-slate-500">
          The code in the school app&apos;s Coolify address. It lets the collector find
          the school&apos;s container.
        </span>
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Reason</span>
        <input
          name="reason"
          required
          maxLength={1000}
          placeholder="School went live"
          className={field}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}

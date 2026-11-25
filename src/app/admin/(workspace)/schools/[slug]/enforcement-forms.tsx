"use client"

import { useActionState, useState } from "react"
import { setEnforcementChoice, setEnforcementMode } from "../../../actions"

function ReasonForm({
  action,
  pending,
  error,
  hidden,
  explain,
  submit,
  placeholder,
  onCancel,
  id,
}: {
  action: (form: FormData) => void
  pending: boolean
  error: string | null
  hidden: Record<string, string>
  explain: string
  submit: string
  placeholder: string
  onCancel: () => void
  id: string
}) {
  return (
    <form action={action} className="mt-3 w-full space-y-2">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <p className="text-sm text-slate-700">{explain}</p>
      <label className="sr-only" htmlFor={id}>
        Reason
      </label>
      <input
        id={id}
        name="reason"
        required
        maxLength={1000}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : submit}
        </button>
        <button
          type="button"
          onClick={onCancel}
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

/** Switch a school between Automatic and Manual enforcement. */
export function ModeSwitch({
  slug,
  mode,
}: {
  slug: string
  mode: "automatic" | "manual"
}) {
  const [error, action, pending] = useActionState(setEnforcementMode, null)
  const [open, setOpen] = useState(false)
  const next = mode === "automatic" ? "manual" : "automatic"
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
      >
        Switch to {next === "manual" ? "Manual" : "Automatic"}
      </button>
    )
  return (
    <ReasonForm
      id={`mode-${slug}`}
      action={action}
      pending={pending}
      error={error}
      hidden={{ slug, mode: next }}
      explain={
        next === "manual"
          ? "Manual: the schedule stops pausing features for this school. Features you have paused yourself stay paused."
          : "Automatic: the platform schedule pauses features as the invoice stays unpaid."
      }
      submit={`Switch to ${next === "manual" ? "Manual" : "Automatic"}`}
      placeholder="Reason, for example: owner agreed a payment date"
      onCancel={() => setOpen(false)}
    />
  )
}

/** Pause one feature, keep it on, or lift your choice. */
export function ChoiceButton({
  slug,
  offering,
  label,
  choice,
}: {
  slug: string
  offering: string
  label: string
  choice: "pause" | "keep_on" | "lift"
}) {
  const [error, action, pending] = useActionState(setEnforcementChoice, null)
  const [open, setOpen] = useState(false)
  const text = { pause: "Pause", keep_on: "Keep on", lift: "Undo" }[choice]
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${choice === "pause" ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
      >
        {text}
      </button>
    )
  return (
    <ReasonForm
      id={`${choice}-${offering}`}
      action={action}
      pending={pending}
      error={error}
      hidden={{ slug, offering, choice }}
      explain={
        choice === "pause"
          ? `${label} pauses for this school within about a minute. Paying the invoice restores it.`
          : choice === "keep_on"
            ? `${label} stays on even when the schedule would pause it, until the invoice is paid.`
            : `Your choice for ${label} is removed; it follows the schedule again.`
      }
      submit={text}
      placeholder="Reason, for example: no reply to three reminders"
      onCancel={() => setOpen(false)}
    />
  )
}

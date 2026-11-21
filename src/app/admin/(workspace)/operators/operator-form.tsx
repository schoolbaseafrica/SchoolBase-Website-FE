"use client"

import { useActionState, useEffect, useRef } from "react"
import { createPlatformOperator } from "@/app/admin/actions"

const field =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500"

export function CreateOperatorForm() {
  const [message, action, pending] = useActionState(createPlatformOperator, null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (message?.startsWith("User added")) formRef.current?.reset()
  }, [message])
  return (
    <form
      ref={formRef}
      action={action}
      className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h2 className="text-xl font-bold">Add user</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input
            name="display_name"
            required
            maxLength={200}
            className={field}
            autoComplete="name"
          />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className={field}
            autoComplete="off"
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Role
          <select name="role" required defaultValue="viewer" className={field}>
            <option value="viewer">Viewer — read only</option>
            <option value="operator">Operator — manage schools and alerts</option>
            <option value="platform_admin">Platform admin — manage users</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Temporary password
          <input
            name="password"
            type="password"
            required
            minLength={12}
            className={field}
            autoComplete="new-password"
          />
          <span className="mt-1 block text-xs font-normal text-slate-500">
            At least 12 characters. Share it with the user through a secure channel.
          </span>
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Reason for access
        <textarea name="reason" required maxLength={1000} rows={2} className={field} />
      </label>
      {message && (
        <p
          role={message.startsWith("User added") ? "status" : "alert"}
          className="text-sm text-slate-700"
        >
          {message}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add user"}
      </button>
    </form>
  )
}

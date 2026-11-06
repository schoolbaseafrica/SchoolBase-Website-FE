"use client"

import { useActionState } from "react"
import { createSchool } from "@/app/admin/actions"

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-red-500"

export function CreateSchoolForm() {
  const [error, action, pending] = useActionState(createSchool, null)

  return (
    <form
      action={action}
      className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          School name
          <input
            className={inputClass}
            name="display_name"
            required
            maxLength={200}
            placeholder="SchoolBase Demo"
          />
        </label>
        <label className="text-sm font-semibold">
          Slug
          <input
            className={inputClass}
            name="slug"
            required
            maxLength={80}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="demo"
          />
          <span className="mt-1 block text-xs font-normal text-slate-500">
            Lowercase letters, numbers, and hyphens. Cannot be changed later.
          </span>
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Website origin
        <input
          className={inputClass}
          name="frontend_url"
          type="url"
          required
          placeholder="https://demo.schoolbase.africa"
        />
      </label>
      <label className="block text-sm font-semibold">
        API origin
        <input
          className={inputClass}
          name="api_url"
          type="url"
          required
          placeholder="https://api.demo.schoolbase.africa"
        />
      </label>
      <label className="block text-sm font-semibold">
        Status
        <select className={inputClass} name="lifecycle_state" defaultValue="onboarding">
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Reason for registration
        <textarea
          className={inputClass}
          name="reason"
          required
          maxLength={1000}
          rows={3}
          placeholder="Register existing school for the Platform pilot"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Registering…" : "Register school"}
      </button>
    </form>
  )
}

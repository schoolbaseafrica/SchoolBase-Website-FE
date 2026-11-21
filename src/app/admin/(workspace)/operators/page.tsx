import Link from "next/link"
import type { Metadata } from "next"
import { platformRequest, formatTime } from "@/lib/platform-admin"
import { CreateOperatorForm } from "./operator-form"

export const metadata: Metadata = {
  title: "Platform users",
  robots: { index: false, follow: false },
}

type Operator = {
  id: string
  display_name: string
  email: string
  role: "viewer" | "operator" | "platform_admin"
  created_at: string
}

export default async function Page() {
  const me = await platformRequest<{ role: string }>("/operators/me")
  if (me.role !== "platform_admin") {
    return <p className="text-slate-600">Only a Platform admin can manage users.</p>
  }
  let operators: Operator[]
  try {
    operators = await platformRequest<Operator[]>("/operators")
  } catch {
    return <p role="alert">Platform users could not be loaded. Reload and try again.</p>
  }
  return (
    <section className="max-w-4xl">
      <Link href="/admin" className="text-sm font-semibold text-red-700 hover:underline">
        ← School overview
      </Link>
      <h1 className="mt-5 text-3xl font-bold">Platform users</h1>
      <p className="mt-2 text-slate-600">
        Add people who can sign in to the Platform dashboard. These accounts do not grant
        access to a school portal.
      </p>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Added</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator) => (
              <tr key={operator.id} className="border-b border-slate-100 last:border-0">
                <td className="p-4 font-semibold">{operator.display_name}</td>
                <td className="p-4">{operator.email}</td>
                <td className="p-4">{operator.role.replaceAll("_", " ")}</td>
                <td className="p-4">{formatTime(operator.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateOperatorForm />
    </section>
  )
}

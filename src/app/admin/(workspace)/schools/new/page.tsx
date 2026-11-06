import Link from "next/link"
import type { Metadata } from "next"
import { platformRequest } from "@/lib/platform-admin"
import { CreateSchoolForm } from "./school-form"

export const metadata: Metadata = {
  title: "Register school",
  robots: { index: false, follow: false },
}

export default async function Page() {
  const operator = await platformRequest<{ role: string }>("/operators/me")
  if (operator.role !== "operator" && operator.role !== "platform_admin") {
    return (
      <section>
        <h1 className="text-3xl font-bold">Register school</h1>
        <p className="mt-4 text-slate-600">Your operator role cannot register schools.</p>
      </section>
    )
  }

  return (
    <section className="max-w-3xl">
      <Link href="/admin" className="text-sm font-semibold text-red-700 hover:underline">
        ← School overview
      </Link>
      <h1 className="mt-5 text-3xl font-bold">Register school</h1>
      <p className="mt-2 text-slate-600">
        Add the school’s existing website and API addresses. Registration records the
        school; it does not deploy or change that school.
      </p>
      <CreateSchoolForm />
    </section>
  )
}

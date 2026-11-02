import Link from "next/link"
import { redirect } from "next/navigation"
import { platformRequest } from "@/lib/platform-admin"
import { signOut } from "../actions"

export const dynamic = "force-dynamic"

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    await platformRequest("/operators/me")
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized")
      redirect("/admin/login")
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-bold">Platform unavailable</h1>
        <p className="mt-2 text-slate-600">
          The operator service could not be reached. Please try again shortly.
        </p>
      </main>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-bold tracking-wide text-red-600">
            SCHOOLBASE{" "}
            <span className="ml-2 text-sm font-medium text-slate-500">Platform</span>
          </Link>
          <form action={signOut}>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  )
}

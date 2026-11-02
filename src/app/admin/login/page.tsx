import type { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Operator sign in",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-widest text-red-600">SCHOOLBASE</p>
        <h1 className="mt-4 text-3xl font-bold">Operator sign in</h1>
        <p className="mt-2 text-slate-600">Private school operations workspace</p>
        <LoginForm />
      </div>
    </main>
  )
}

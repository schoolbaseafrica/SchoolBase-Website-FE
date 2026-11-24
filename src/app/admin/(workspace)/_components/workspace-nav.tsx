"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/alerts", label: "Alerts" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/infrastructure", label: "Infrastructure" },
  { href: "/admin/billing", label: "Billing" },
]

/** The operator console's sections; Platform users only for platform admins. */
export function WorkspaceNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const links = isAdmin
    ? [...LINKS, { href: "/admin/operators", label: "Platform users" }]
    : LINKS
  return (
    <nav aria-label="Platform sections" className="border-b border-slate-200 bg-white">
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap ${active ? "border-red-600 text-red-700" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

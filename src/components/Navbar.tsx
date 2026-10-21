"use client"

import React, { useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Logo from "./logo"

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Modules", path: "/modules" },
    { label: "About", path: "/about" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-3 right-3 left-3 z-50 mx-auto max-w-[1180px] rounded-full border border-[#efe5e6] bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(40,25,28,.07)] backdrop-blur-md sm:right-6 sm:left-6 lg:px-7">
        <div className="relative flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation - Centered */}
          <section className="absolute left-1/2 hidden -translate-x-1/2 gap-3 text-sm font-medium lg:flex lg:gap-5">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-2 py-2 transition-colors duration-200 ${isActive ? "text-accent" : "text-[#535353]"} hover:text-accent`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </section>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <Link href="/contact-us">
              <Button className="h-10 rounded-full px-5 text-sm">Consult Us</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-[#2D2D2D] transition-colors hover:text-[#535353] lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-site-menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/10 lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <nav
              id="mobile-site-menu"
              aria-label="Mobile navigation"
              className="fixed top-[5.5rem] right-3 left-3 z-[60] max-h-[calc(100dvh-6.25rem)] overflow-y-auto rounded-3xl border border-[#efe5e6] bg-white p-3 shadow-[0_18px_48px_rgba(40,25,28,.16)] sm:right-6 sm:left-auto sm:w-96 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={closeMobileMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive ? "text-accent bg-[#fbebec]" : "text-[#535353] hover:bg-gray-50 hover:text-[#2D2D2D]"}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-2 border-t border-[#efe5e6] px-2 pt-3">
                <Button asChild className="h-11 w-full rounded-full text-sm">
                  <Link href="/contact-us" onClick={closeMobileMenu}>
                    Consult Us
                  </Link>
                </Button>
              </div>
            </nav>
          </>,
          document.body
        )}
    </>
  )
}

export default Navbar

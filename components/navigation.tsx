"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { AuthButton } from "./auth-button"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00ff9d] rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">LFH</span>
            </div>
            <span className="font-mono font-bold text-lg hidden sm:inline">LinuxFixHub</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="text-xs sm:text-sm">
                Home
              </Button>
            </Link>
            <Link href="/search">
              <Button variant={isActive("/search") ? "default" : "ghost"} size="sm" className="text-xs sm:text-sm">
                Issues
              </Button>
            </Link>
            <Link href="/problems">
              <Button variant={isActive("/problems") ? "default" : "ghost"} size="sm" className="text-xs sm:text-sm">
                Questions
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant={isActive("/submit") ? "default" : "ghost"} size="sm" className="text-xs sm:text-sm">
                Submit
              </Button>
            </Link>
            <Link href="/about">
              <Button variant={isActive("/about") ? "default" : "ghost"} size="sm" className="text-xs sm:text-sm">
                About
              </Button>
            </Link>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

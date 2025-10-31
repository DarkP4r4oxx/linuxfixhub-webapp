"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut, LogIn, User } from "lucide-react"

export function AuthButton() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("[v0] Error signing out:", error)
    }
  }

  if (isLoading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
          <User className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
        </Button>
        <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-xs sm:text-sm">
          <LogOut className="w-4 h-4 mr-1" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Link href="/auth/login">
      <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
        <LogIn className="w-4 h-4 mr-1" />
        Sign In
      </Button>
    </Link>
  )
}

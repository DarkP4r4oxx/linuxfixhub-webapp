"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES, DISTROS } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function AskProblemPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    distro: "Ubuntu" as const,
    category: "",
    tags: "",
  })

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
      setIsLoading(false)
    }
    getUser()
  }, [supabase.auth, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          distro: formData.distro,
          category: formData.category,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      })

      if (response.ok) {
        const newProblem = await response.json()
        setSubmitted(true)
        setTimeout(() => {
          router.push(`/problem/${newProblem.id}`)
        }, 2000)
      } else {
        alert("Failed to submit problem")
      }
    } catch (error) {
      console.error("[v0] Error submitting problem:", error)
      alert("Error submitting problem")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-[#00ff9d] mx-auto" />
          <h1 className="text-3xl font-mono font-bold">Problem Posted!</h1>
          <p className="text-muted-foreground">Thank you for your question. Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-mono font-bold mb-2">Ask a Linux Problem</h1>
          <p className="text-muted-foreground">Get help from the community with your Linux issues</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Question Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., How do I fix no sound output on Ubuntu?"
                value={formData.title}
                onChange={handleChange}
                className="font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                placeholder="Describe your problem in detail. What have you tried so far?"
                value={formData.description}
                onChange={handleChange}
                className="font-mono min-h-24"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono font-semibold mb-2">
                  Distribution <span className="text-red-500">*</span>
                </label>
                <select
                  name="distro"
                  value={formData.distro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
                >
                  {DISTROS.map((distro) => (
                    <option key={distro} value={distro}>
                      {distro}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono font-semibold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono font-semibold mb-2">Tags</label>
              <Input
                type="text"
                name="tags"
                placeholder="e.g., audio, networking, boot (comma-separated)"
                value={formData.tags}
                onChange={handleChange}
                className="font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-mono font-semibold"
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

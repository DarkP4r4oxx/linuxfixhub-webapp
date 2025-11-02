"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES, DISTROS } from "@/lib/data"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function SubmitPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    distro: "Ubuntu" as const,
    category: "",
    tags: "",
    stepsToFix: "",
    commands: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category || !formData.stepsToFix) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/issues", {
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
          stepsToFix: formData.stepsToFix,
          commands: formData.commands
            .split("\n")
            .map((cmd) => cmd.trim())
            .filter((cmd) => cmd),
        }),
      })

      if (response.ok) {
        const newIssue = await response.json()
        setSubmitted(true)
        setTimeout(() => {
          router.push(`/issue/${newIssue.id}`)
        }, 2000)
      } else {
        alert("Failed to submit issue")
      }
    } catch (error) {
      console.error("[v0] Error submitting issue:", error)
      alert("Error submitting issue")
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-4">
          <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-[#00ff9d] mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-mono font-bold">Issue Submitted!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Thank you for contributing to LinuxFixHub. Redirecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">Submit a Linux Fix</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Help the community by sharing your solution</p>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., No Sound Output on Ubuntu 22.04"
                value={formData.title}
                onChange={handleChange}
                className="font-mono text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                className="font-mono text-sm min-h-20 sm:min-h-24"
                required
              />
            </div>

            {/* Distro and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">
                  Distribution <span className="text-red-500">*</span>
                </label>
                <select
                  name="distro"
                  value={formData.distro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-xs sm:text-sm"
                >
                  {DISTROS.map((distro) => (
                    <option key={distro} value={distro}>
                      {distro}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-xs sm:text-sm"
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

            {/* Tags */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">Tags</label>
              <Input
                type="text"
                name="tags"
                placeholder="e.g., audio, pulseaudio, alsa (comma-separated)"
                value={formData.tags}
                onChange={handleChange}
                className="font-mono text-sm"
              />
            </div>

            {/* Steps to Fix */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">
                Steps to Fix <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="stepsToFix"
                placeholder="1. First step&#10;2. Second step&#10;3. Third step"
                value={formData.stepsToFix}
                onChange={handleChange}
                className="font-mono text-sm min-h-28 sm:min-h-32"
                required
              />
            </div>

            {/* Commands */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-semibold mb-2">Commands Used</label>
              <Textarea
                name="commands"
                placeholder="Enter each command on a new line&#10;e.g.:&#10;aplay -l&#10;systemctl restart pulseaudio"
                value={formData.commands}
                onChange={handleChange}
                className="font-mono text-sm min-h-20 sm:min-h-24"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold py-6"
            >
              {isLoading ? "Submitting..." : "Submit Issue"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

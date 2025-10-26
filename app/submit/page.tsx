"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES, DISTROS, type Issue } from "@/lib/data"
import { useIssueStore } from "@/lib/store"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function SubmitPage() {
  const router = useRouter()
  const addIssue = useIssueStore((state) => state.addIssue)
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category || !formData.stepsToFix) {
      alert("Please fill in all required fields")
      return
    }

    const newIssue: Issue = {
      id: Date.now().toString(),
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
      upvotes: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    addIssue(newIssue)
    setSubmitted(true)

    setTimeout(() => {
      router.push(`/issue/${newIssue.id}`)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-[#00ff9d] mx-auto" />
          <h1 className="text-3xl font-mono font-bold">Issue Submitted!</h1>
          <p className="text-muted-foreground">Thank you for contributing to LinuxFixHub. Redirecting...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-mono font-bold mb-2">Submit a Linux Fix</h1>
          <p className="text-muted-foreground">Help the community by sharing your solution</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., No Sound Output on Ubuntu 22.04"
                value={formData.title}
                onChange={handleChange}
                className="font-mono"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                className="font-mono min-h-24"
                required
              />
            </div>

            {/* Distro and Category */}
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">Tags</label>
              <Input
                type="text"
                name="tags"
                placeholder="e.g., audio, pulseaudio, alsa (comma-separated)"
                value={formData.tags}
                onChange={handleChange}
                className="font-mono"
              />
            </div>

            {/* Steps to Fix */}
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Steps to Fix <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="stepsToFix"
                placeholder="1. First step&#10;2. Second step&#10;3. Third step"
                value={formData.stepsToFix}
                onChange={handleChange}
                className="font-mono min-h-32"
                required
              />
            </div>

            {/* Commands */}
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">Commands Used</label>
              <Textarea
                name="commands"
                placeholder="Enter each command on a new line&#10;e.g.:&#10;aplay -l&#10;systemctl restart pulseaudio"
                value={formData.commands}
                onChange={handleChange}
                className="font-mono min-h-24"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold"
            >
              Submit Issue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

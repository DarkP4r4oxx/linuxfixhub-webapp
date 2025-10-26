"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" })
        setSubmitted(false)
      }, 3000)
    }
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
          <h1 className="text-3xl font-mono font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Have feedback or questions? We'd love to hear from you.</p>
        </div>

        {submitted ? (
          <Card className="p-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-[#00ff9d] mx-auto" />
            <h2 className="text-xl font-mono font-bold">Message Sent!</h2>
            <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-mono font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-semibold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="font-mono min-h-32"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold"
              >
                Send Message
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

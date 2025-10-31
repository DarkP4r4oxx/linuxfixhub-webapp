"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IssueCard } from "@/components/issue-card"
import { SearchBar } from "@/components/search-bar"
import { CATEGORIES, initialIssues } from "@/lib/data"
import { useIssueStore } from "@/lib/store"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const issues = useIssueStore((state) => state.issues)

  useEffect(() => {
    setMounted(true)
    // Initialize with sample data if empty
    if (issues.length === 0) {
      initialIssues.forEach((issue) => {
        useIssueStore.getState().addIssue(issue)
      })
    }
  }, [issues.length])

  if (!mounted) return null

  const filteredIssues = issues
    .filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tracking-tight">
            Find and Fix Your
            <br />
            <span className="text-[#00ff9d]">Linux Problems</span>
            <br />
            Fast ⚡
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A community-driven knowledge base for Linux users. Search solutions, submit fixes, and help others solve
            system errors, configuration issues, and command problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/search">
              <Button size="lg" className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold">
                Explore Issues
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/submit">
              <Button size="lg" variant="outline" className="font-mono font-semibold bg-transparent">
                Submit a Fix
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search issues by title or description..."
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-mono font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/search?category=${category}`}>
              <Card className="p-4 text-center hover:border-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all cursor-pointer h-full flex items-center justify-center">
                <span className="font-mono text-sm font-semibold">{category}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Issues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-mono font-bold">Latest Issues</h2>
          <Link href="/search">
            <Button variant="ghost" className="text-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/10">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No issues found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* New CTA for Problems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 sm:p-12 border-blue-500/30 bg-blue-500/5">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold">Need Help with Your Linux Setup?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ask your questions and get answers from experienced Linux users in the community.
            </p>
            <Link href="/ask-problem">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-semibold">
                Ask a Question
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 sm:p-12 border-[#00ff9d]/30 bg-[#00ff9d]/5">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold">Have a Linux Fix to Share?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Help the community by submitting your solutions to common Linux problems.
            </p>
            <Link href="/submit">
              <Button size="lg" className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold">
                Contribute Your Fix
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CATEGORIES, DISTROS } from "@/lib/data"
import { ArrowRight, ThumbsUp } from "lucide-react"

interface Problem {
  id: string
  title: string
  description: string
  distro: string
  category: string
  tags: string[]
  upvotes: number
  created_at: string
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistro, setSelectedDistro] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedDistro !== "all") params.append("distro", selectedDistro)
        if (selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/problems?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProblems(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching problems:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblems()
  }, [searchQuery, selectedDistro, selectedCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-mono font-bold">Community Questions</h1>
        <Link href="/ask-problem">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-semibold">Ask Question</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-mono"
        />
        <select
          value={selectedDistro}
          onChange={(e) => setSelectedDistro(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
        >
          <option value="all">All Distributions</option>
          {DISTROS.map((distro) => (
            <option key={distro} value={distro}>
              {distro}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Problems List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      ) : problems.length > 0 ? (
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link key={problem.id} href={`/problem/${problem.id}`}>
              <Card className="p-4 sm:p-6 hover:border-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all cursor-pointer">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono font-semibold">
                        {problem.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{problem.distro}</span>
                    </div>
                    <h3 className="text-lg font-mono font-bold mb-2">{problem.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{problem.description}</p>
                    {problem.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-mono">{problem.upvotes}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/10"
                    >
                      View
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No problems found.</p>
          <Link href="/ask-problem">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-semibold">
              Ask the first question
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

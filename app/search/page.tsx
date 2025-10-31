"use client"

import { useEffect } from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { IssueCard } from "@/components/issue-card"
import { SearchBar } from "@/components/search-bar"
import { CATEGORIES, DISTROS, initialIssues } from "@/lib/data"
import { useIssueStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistro, setSelectedDistro] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [mounted, setMounted] = useState(false)
  const issues = useIssueStore((state) => state.issues)

  useEffect(() => {
    setMounted(true)
    if (issues.length === 0) {
      initialIssues.forEach((issue) => {
        useIssueStore.getState().addIssue(issue)
      })
    }
  }, [issues.length])

  if (!mounted) return null

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDistro = !selectedDistro || issue.distro === selectedDistro
    const matchesCategory = !selectedCategory || issue.category === selectedCategory

    return matchesSearch && matchesDistro && matchesCategory
  })

  const hasFilters = searchQuery || selectedDistro || selectedCategory

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-mono font-bold mb-2">Search Issues</h1>
          <p className="text-muted-foreground">Find solutions to Linux problems</p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, description, or tags..."
        />

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono font-semibold mb-2">Distribution</label>
            <select
              value={selectedDistro}
              onChange={(e) => setSelectedDistro(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
            >
              <option value="">All Distributions</option>
              {DISTROS.map((distro) => (
                <option key={distro} value={distro}>
                  {distro}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-mono font-semibold mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-md font-mono text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-xs">
                Search: {searchQuery}
                <X className="ml-1 w-3 h-3" />
              </Button>
            )}
            {selectedDistro && (
              <Button variant="outline" size="sm" onClick={() => setSelectedDistro("")} className="text-xs">
                {selectedDistro}
                <X className="ml-1 w-3 h-3" />
              </Button>
            )}
            {selectedCategory && (
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory("")} className="text-xs">
                {selectedCategory}
                <X className="ml-1 w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found {filteredIssues.length} issue{filteredIssues.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No issues found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

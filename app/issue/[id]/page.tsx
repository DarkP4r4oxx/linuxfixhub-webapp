"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useComments } from "@/hooks/use-comments"
import type { Issue } from "@/lib/data"
import { ThumbsUp, Copy, ArrowLeft, Send } from "lucide-react"

export default function IssuePage() {
  const params = useParams()
  const issueId = params.id as string
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentText, setCommentText] = useState("")
  const [copied, setCopied] = useState(false)
  const [userUpvoted, setUserUpvoted] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const { comments, mutate: mutateComments } = useComments(issueId)

  // Fetch issue details
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`/api/issues?search=${issueId}`)
        const data = await response.json()
        const foundIssue = data.find((i: Issue) => i.id === issueId)
        setIssue(foundIssue || null)
      } catch (error) {
        console.error("[v0] Error fetching issue:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchIssue()
  }, [issueId])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/search">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Issue not found</p>
        </div>
      </div>
    )
  }

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpvote = async () => {
    if (!userUpvoted) {
      try {
        await fetch(`/api/issues/${issueId}/upvote`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ upvotes: issue.upvotes + 1 }),
        })
        setIssue({ ...issue, upvotes: issue.upvotes + 1 })
        setUserUpvoted(true)
      } catch (error) {
        console.error("[v0] Error upvoting:", error)
      }
    }
  }

  const handleAddComment = async () => {
    if (commentAuthor.trim() && commentText.trim()) {
      setIsSubmittingComment(true)
      try {
        await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            issueId,
            author: commentAuthor,
            text: commentText,
          }),
        })
        setCommentAuthor("")
        setCommentText("")
        mutateComments()
      } catch (error) {
        console.error("[v0] Error adding comment:", error)
      } finally {
        setIsSubmittingComment(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/search">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </Link>

      <article className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#00ff9d] text-black">{issue.distro}</Badge>
            <Badge variant="outline">{issue.category}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold">{issue.title}</h1>
          <p className="text-lg text-muted-foreground">{issue.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {issue.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Upvote Section */}
        <Card className="p-4 border-[#00ff9d]/30 bg-[#00ff9d]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-[#00ff9d]" />
              <span className="font-mono font-semibold">{issue.upvotes} upvotes</span>
            </div>
            <Button
              onClick={handleUpvote}
              disabled={userUpvoted}
              className={userUpvoted ? "opacity-50" : "bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"}
            >
              {userUpvoted ? "Upvoted" : "Upvote"}
            </Button>
          </div>
        </Card>

        {/* Steps to Fix */}
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold">Steps to Fix</h2>
          <Card className="p-6 space-y-3">
            {issue.stepsToFix.split("\n").map((step, idx) => (
              <p key={idx} className="text-foreground font-mono text-sm leading-relaxed">
                {step}
              </p>
            ))}
          </Card>
        </div>

        {/* Commands */}
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold">Commands Used</h2>
          <div className="space-y-2">
            {issue.commands.map((command, idx) => (
              <Card key={idx} className="p-4 bg-card/50 border-border/50 flex items-center justify-between group">
                <code className="font-mono text-sm text-[#00ff9d] break-all">{command}</code>
                <Button
                  onClick={() => handleCopyCommand(command)}
                  className="ml-2 p-1.5 bg-[#00ff9d]/20 hover:bg-[#00ff9d]/30 text-[#00ff9d] border border-[#00ff9d]/30 rounded"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold">Comments</h2>
          <Card className="p-4 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
            )}
          </Card>
        </div>

        {/* Add Comment Form */}
        <Card className="p-4 space-y-3">
          <h3 className="font-mono font-semibold">Add a Comment</h3>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Your name"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="flex-1"
            />
            <Textarea
              placeholder="Your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddComment}
              disabled={!commentAuthor.trim() || !commentText.trim() || isSubmittingComment}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </Card>
      </article>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, ThumbsUp } from "lucide-react"

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

interface Answer {
  id: string
  content: string
  upvotes: number
  is_accepted: boolean
  created_at: string
}

export default function ProblemPage() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState("")
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        const problemResponse = await fetch(`/api/problems/${id}`)
        if (problemResponse.ok) {
          const problemData = await problemResponse.json()
          setProblem(problemData)
        }

        const answersResponse = await fetch(`/api/problems/${id}/answers`)
        if (answersResponse.ok) {
          const answersData = await answersResponse.json()
          setAnswers(answersData)
        }
      } catch (error) {
        console.error("[v0] Error fetching problem:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchData()
  }, [id, supabase.auth])

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Please sign in to answer")
      return
    }

    if (!answerContent.trim()) {
      alert("Please enter your answer")
      return
    }

    setIsSubmittingAnswer(true)
    try {
      const response = await fetch(`/api/problems/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent }),
      })

      if (response.ok) {
        const newAnswer = await response.json()
        setAnswers([...answers, newAnswer])
        setAnswerContent("")
      } else {
        alert("Failed to submit answer")
      }
    } catch (error) {
      console.error("[v0] Error submitting answer:", error)
      alert("Error submitting answer")
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const handleUpvoteProblem = async () => {
    try {
      await fetch(`/api/problems/${id}/upvote`, { method: "PATCH" })
      if (problem) {
        setProblem({ ...problem, upvotes: problem.upvotes + 1 })
      }
    } catch (error) {
      console.error("[v0] Error upvoting problem:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-foreground">Problem not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/problems">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </Button>
      </Link>

      {/* Problem Card */}
      <Card className="p-6 sm:p-8 mb-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-[#00ff9d]/10 text-[#00ff9d] rounded text-xs font-mono font-semibold">
                {problem.category}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{problem.distro}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-3">{problem.title}</h1>
            <p className="text-muted-foreground mb-4">{problem.description}</p>
            {problem.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {problem.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleUpvoteProblem}
            variant="outline"
            className="flex flex-col items-center gap-1 h-auto py-3 px-4 bg-transparent"
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-mono font-semibold">{problem.upvotes}</span>
          </Button>
        </div>
      </Card>

      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-mono font-bold mb-4">{answers.length} Answers</h2>
        <div className="space-y-4">
          {answers.map((answer) => (
            <Card key={answer.id} className="p-4 sm:p-6">
              {answer.is_accepted && (
                <div className="mb-3 text-xs font-mono font-semibold text-[#00ff9d] bg-[#00ff9d]/10 w-fit px-2 py-1 rounded">
                  ✓ Accepted Answer
                </div>
              )}
              <p className="text-muted-foreground mb-4">{answer.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(answer.created_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {answer.upvotes}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Answer Section */}
      {user ? (
        <Card className="p-6 sm:p-8">
          <h3 className="text-lg font-mono font-bold mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <Textarea
              placeholder="Write your answer here..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              className="font-mono min-h-32"
            />
            <Button
              type="submit"
              disabled={isSubmittingAnswer}
              className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold"
            >
              {isSubmittingAnswer ? "Submitting..." : "Post Answer"}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 text-center">
          <p className="text-muted-foreground mb-4">Sign in to answer this question</p>
          <Link href="/auth/login">
            <Button className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-mono font-semibold">Sign In</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

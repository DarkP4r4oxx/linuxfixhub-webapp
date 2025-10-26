import { create } from "zustand"
import type { Issue, Comment } from "./data"

interface IssueStore {
  issues: Issue[]
  comments: Record<string, Comment[]>
  addIssue: (issue: Issue) => void
  updateIssueUpvotes: (issueId: string, increment: number) => void
  addComment: (issueId: string, comment: Comment) => void
  getComments: (issueId: string) => Comment[]
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("issues") || "[]") : [],
  comments: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("comments") || "{}") : {},

  addIssue: (issue) => {
    set((state) => {
      const newIssues = [...state.issues, issue]
      if (typeof window !== "undefined") {
        localStorage.setItem("issues", JSON.stringify(newIssues))
      }
      return { issues: newIssues }
    })
  },

  updateIssueUpvotes: (issueId, increment) => {
    set((state) => {
      const newIssues = state.issues.map((issue) =>
        issue.id === issueId ? { ...issue, upvotes: Math.max(0, issue.upvotes + increment) } : issue,
      )
      if (typeof window !== "undefined") {
        localStorage.setItem("issues", JSON.stringify(newIssues))
      }
      return { issues: newIssues }
    })
  },

  addComment: (issueId, comment) => {
    set((state) => {
      const newComments = {
        ...state.comments,
        [issueId]: [...(state.comments[issueId] || []), comment],
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("comments", JSON.stringify(newComments))
      }
      return { comments: newComments }
    })
  },

  getComments: (issueId) => {
    return get().comments[issueId] || []
  },
}))

import useSWR from "swr"
import type { Comment } from "@/lib/data"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useComments(issueId: string) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(`/api/comments?issueId=${issueId}`, fetcher)

  return {
    comments: data || [],
    isLoading,
    error,
    mutate,
  }
}

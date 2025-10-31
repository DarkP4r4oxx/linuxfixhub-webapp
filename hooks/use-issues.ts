import useSWR from "swr"
import type { Issue } from "@/lib/data"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useIssues(distro?: string, category?: string, search?: string) {
  const params = new URLSearchParams()
  if (distro && distro !== "all") params.append("distro", distro)
  if (category && category !== "all") params.append("category", category)
  if (search) params.append("search", search)

  const queryString = params.toString()
  const url = `/api/issues${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<Issue[]>(url, fetcher)

  return {
    issues: data || [],
    isLoading,
    error,
    mutate,
  }
}

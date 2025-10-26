"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Issue } from "@/lib/data"
import { ThumbsUp } from "lucide-react"

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issue/${issue.id}`}>
      <Card className="p-4 hover:border-[#00ff9d] transition-colors cursor-pointer h-full">
        <div className="space-y-3">
          <div>
            <h3 className="font-mono font-semibold text-base line-clamp-2 hover:text-[#00ff9d] transition-colors">
              {issue.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{issue.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {issue.distro}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {issue.category}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {issue.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30">
                {tag}
              </Badge>
            ))}
            {issue.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{issue.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <ThumbsUp className="w-4 h-4 text-[#00ff9d]" />
            <span className="text-sm font-mono text-muted-foreground">{issue.upvotes}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

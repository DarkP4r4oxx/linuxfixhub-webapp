import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: problem, error: fetchError } = await supabase.from("problems").select("upvotes").eq("id", id).single()

    if (fetchError) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from("problems")
      .update({ upvotes: (problem?.upvotes || 0) + 1 })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error upvoting problem:", error)
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 })
  }
}

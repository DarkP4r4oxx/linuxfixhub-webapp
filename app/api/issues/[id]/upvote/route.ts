import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase.from("issues").update({ upvotes: body.upvotes }).eq("id", id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Error upvoting issue:", error)
    return NextResponse.json({ error: "Failed to upvote issue" }, { status: 500 })
  }
}

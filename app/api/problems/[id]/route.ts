import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching problem:", error)
    return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 })
  }
}

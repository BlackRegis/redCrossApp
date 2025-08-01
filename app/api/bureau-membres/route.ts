import { NextResponse } from "next/server"
import { fetchBureauMembers, createBureauMember } from "@/lib/database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bureauId = searchParams.get("bureauId")

  try {
    const members = await fetchBureauMembers(bureauId ? Number.parseInt(bureauId) : undefined)
    return NextResponse.json(members)
  } catch (error) {
    console.error("API Error: Failed to fetch bureau members.", error)
    return NextResponse.json({ message: "Failed to fetch bureau members" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newMember = await createBureauMember(body)
    return NextResponse.json(newMember, { status: 201 })
  } catch (error: any) {
    console.error("API Error: Failed to create bureau member.", error)
    return NextResponse.json({ message: error.message || "Failed to create bureau member" }, { status: 500 })
  }
}

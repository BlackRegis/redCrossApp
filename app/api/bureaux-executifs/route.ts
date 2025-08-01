import { NextResponse } from "next/server"
import { fetchExecutiveBureaus, createExecutiveBureau } from "@/lib/database"

export async function GET() {
  try {
    const bureaus = await fetchExecutiveBureaus()
    return NextResponse.json(bureaus)
  } catch (error) {
    console.error("API Error: Failed to fetch executive bureaus.", error)
    return NextResponse.json({ message: "Failed to fetch executive bureaus" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newBureau = await createExecutiveBureau(body)
    return NextResponse.json(newBureau, { status: 201 })
  } catch (error: any) {
    console.error("API Error: Failed to create executive bureau.", error)
    return NextResponse.json({ message: error.message || "Failed to create executive bureau" }, { status: 500 })
  }
}

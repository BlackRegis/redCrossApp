import { NextResponse } from "next/server"
import { fetchAppSettings } from "@/lib/database"

export async function GET() {
  try {
    const settings = await fetchAppSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("API Error: Failed to fetch app settings.", error)
    return NextResponse.json({ message: "Failed to fetch app settings" }, { status: 500 })
  }
}

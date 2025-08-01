import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const settings = await sql`SELECT setting_key, setting_value FROM app_settings`
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching app settings:", error)
    return NextResponse.json({ error: "Failed to fetch app settings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { setting_key, setting_value } = await req.json()
    if (!setting_key || !setting_value) {
      return NextResponse.json({ error: "Missing setting_key or setting_value" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES (${setting_key}, ${setting_value})
      ON CONFLICT (setting_key) DO UPDATE SET
        setting_value = EXCLUDED.setting_value
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating app setting:", error)
    return NextResponse.json({ error: "Failed to update app setting" }, { status: 500 })
  }
}

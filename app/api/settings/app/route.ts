import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM app_settings;`
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value
      return acc
    }, {})
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching app settings:", error)
    return NextResponse.json({ error: "Failed to fetch app settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { setting_key, setting_value } = await request.json()
    if (!setting_key || !setting_value) {
      return NextResponse.json({ error: "Setting key and value are required" }, { status: 400 })
    }

    const { rowCount } = await sql`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES (${setting_key}, ${setting_value})
      ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP;
    `

    if (rowCount > 0) {
      return NextResponse.json({ message: "Setting updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating app setting:", error)
    return NextResponse.json({ error: "Failed to update app setting" }, { status: 500 })
  }
}

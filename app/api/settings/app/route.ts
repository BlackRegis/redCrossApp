import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM settings;`
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value
      return acc
    }, {})
    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error("Error fetching app settings:", error)
    return NextResponse.json({ error: "Failed to fetch app settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const updates = []
    for (const key in body) {
      updates.push(sql`
        INSERT INTO settings (setting_key, setting_value)
        VALUES (${key}, ${body[key]})
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP;
      `)
    }
    await Promise.all(updates)
    return NextResponse.json({ message: "App settings updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating app settings:", error)
    return NextResponse.json({ error: "Failed to update app settings" }, { status: 500 })
  }
}

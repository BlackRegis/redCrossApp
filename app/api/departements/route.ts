import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM departments ORDER BY name ASC;`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, head_name, contact_email, phone_number } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }

    const { rows } = await sql`
      INSERT INTO departments (name, head_name, contact_email, phone_number)
      VALUES (${name}, ${head_name || null}, ${contact_email || null}, ${phone_number || null})
      RETURNING *;
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
  }
}

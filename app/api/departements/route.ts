import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM departments ORDER BY name ASC;`
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, head_of_department, contact_email } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }
    const { rows } = await sql`
      INSERT INTO departments (name, head_of_department, contact_email)
      VALUES (${name}, ${head_of_department || null}, ${contact_email || null})
      RETURNING *;
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
  }
}

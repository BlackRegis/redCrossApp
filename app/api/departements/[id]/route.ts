import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM departments WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching department by ID:", error)
    return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, head_name, contact_email, phone_number } = await request.json()

    const { rowCount } = await sql`
      UPDATE departments
      SET
        name = COALESCE(${name}, name),
        head_name = COALESCE(${head_name}, head_name),
        contact_email = COALESCE(${contact_email}, contact_email),
        phone_number = COALESCE(${phone_number}, phone_number),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `

    if (rowCount === 0) {
      return NextResponse.json({ error: "Department not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json({ message: "Department updated successfully" })
  } catch (error) {
    console.error("Error updating department:", error)
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rowCount } = await sql`DELETE FROM departments WHERE id = ${id};`
    if (rowCount === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Department deleted successfully" })
  } catch (error) {
    console.error("Error deleting department:", error)
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
  }
}

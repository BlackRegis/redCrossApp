import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM departments WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error fetching department with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, head_of_department, contact_email } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }
    const { rows } = await sql`
      UPDATE departments
      SET name = ${name}, head_of_department = ${head_of_department || null}, contact_email = ${contact_email || null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error updating department with ID ${params.id}:`, error)
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
    return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting department with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
  }
}

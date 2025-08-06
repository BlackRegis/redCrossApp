import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM arrondissements WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error fetching arrondissement with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch arrondissement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, department_id, population } = await request.json()
    if (!name || !department_id) {
      return NextResponse.json({ error: "Name and department_id are required" }, { status: 400 })
    }
    const { rows } = await sql`
      UPDATE arrondissements
      SET name = ${name}, department_id = ${department_id}, population = ${population || null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error updating arrondissement with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update arrondissement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rowCount } = await sql`DELETE FROM arrondissements WHERE id = ${id};`
    if (rowCount === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Arrondissement deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting arrondissement with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete arrondissement" }, { status: 500 })
  }
}

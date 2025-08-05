import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM arrondissements WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching arrondissement by ID:", error)
    return NextResponse.json({ error: "Failed to fetch arrondissement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, population, department_id } = await request.json()

    const { rowCount } = await sql`
      UPDATE arrondissements
      SET
        name = COALESCE(${name}, name),
        population = COALESCE(${population}, population),
        department_id = COALESCE(${department_id}, department_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `

    if (rowCount === 0) {
      return NextResponse.json({ error: "Arrondissement not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json({ message: "Arrondissement updated successfully" })
  } catch (error) {
    console.error("Error updating arrondissement:", error)
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
    return NextResponse.json({ message: "Arrondissement deleted successfully" })
  } catch (error) {
    console.error("Error deleting arrondissement:", error)
    return NextResponse.json({ error: "Failed to delete arrondissement" }, { status: 500 })
  }
}

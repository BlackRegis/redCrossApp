import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const departement = await sql`SELECT * FROM departements WHERE id = ${id}`
    if (departement.length === 0) {
      return NextResponse.json({ error: "Departement not found" }, { status: 404 })
    }
    return NextResponse.json(departement[0])
  } catch (error) {
    console.error("Error fetching departement:", error)
    return NextResponse.json({ error: "Failed to fetch departement" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { nom, description } = await req.json()
    if (!nom) {
      return NextResponse.json({ error: "Nom is required" }, { status: 400 })
    }
    const result = await sql`
      UPDATE departements
      SET nom = ${nom}, description = ${description || null}
      WHERE id = ${id}
      RETURNING *
    `
    if (result.length === 0) {
      return NextResponse.json({ error: "Departement not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating departement:", error)
    return NextResponse.json({ error: "Failed to update departement" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    // Delete associated arrondissements first
    await sql`DELETE FROM arrondissements WHERE departement_id = ${id}`
    const result = await sql`DELETE FROM departements WHERE id = ${id} RETURNING id`
    if (result.length === 0) {
      return NextResponse.json({ error: "Departement not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Departement and associated arrondissements deleted" })
  } catch (error) {
    console.error("Error deleting departement:", error)
    return NextResponse.json({ error: "Failed to delete departement" }, { status: 500 })
  }
}

import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const arrondissement = await sql`SELECT * FROM arrondissements WHERE id = ${id}`
    if (arrondissement.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json(arrondissement[0])
  } catch (error) {
    console.error("Error fetching arrondissement:", error)
    return NextResponse.json({ error: "Failed to fetch arrondissement" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { nom, description, departement_id } = await req.json()
    if (!nom || !departement_id) {
      return NextResponse.json({ error: "Nom and departement_id are required" }, { status: 400 })
    }
    const result = await sql`
      UPDATE arrondissements
      SET nom = ${nom}, description = ${description || null}, departement_id = ${departement_id}
      WHERE id = ${id}
      RETURNING *
    `
    if (result.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating arrondissement:", error)
    return NextResponse.json({ error: "Failed to update arrondissement" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`DELETE FROM arrondissements WHERE id = ${id} RETURNING id`
    if (result.length === 0) {
      return NextResponse.json({ error: "Arrondissement not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Arrondissement deleted" })
  } catch (error) {
    console.error("Error deleting arrondissement:", error)
    return NextResponse.json({ error: "Failed to delete arrondissement" }, { status: 500 })
  }
}

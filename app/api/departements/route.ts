import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const departements = await sql`SELECT * FROM departements ORDER BY nom`
    return NextResponse.json(departements)
  } catch (error) {
    console.error("Error fetching departements:", error)
    return NextResponse.json({ error: "Failed to fetch departements" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nom, description } = await req.json()
    if (!nom) {
      return NextResponse.json({ error: "Nom is required" }, { status: 400 })
    }
    const result = await sql`
      INSERT INTO departements (nom, description)
      VALUES (${nom}, ${description || null})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating departement:", error)
    return NextResponse.json({ error: "Failed to create departement" }, { status: 500 })
  }
}

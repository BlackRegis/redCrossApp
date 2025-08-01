import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const membre = await sql`SELECT * FROM membres WHERE id = ${id}`
    if (membre.length === 0) {
      return NextResponse.json({ error: "Membre not found" }, { status: 404 })
    }
    return NextResponse.json(membre[0])
  } catch (error) {
    console.error("Error fetching membre:", error)
    return NextResponse.json({ error: "Failed to fetch membre" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const {
      nom,
      prenom,
      date_naissance,
      lieu_naissance,
      sexe,
      nationalite,
      adresse,
      telephone,
      email,
      profession,
      date_adhesion,
      type_membre,
      statut,
      notes,
    } = await req.json()

    if (!nom || !prenom) {
      return NextResponse.json({ error: "Nom and Prenom are required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE membres
      SET
        nom = ${nom},
        prenom = ${prenom},
        date_naissance = ${date_naissance || null},
        lieu_naissance = ${lieu_naissance || null},
        sexe = ${sexe || null},
        nationalite = ${nationalite || null},
        adresse = ${adresse || null},
        telephone = ${telephone || null},
        email = ${email || null},
        profession = ${profession || null},
        date_adhesion = ${date_adhesion || null},
        type_membre = ${type_membre || null},
        statut = ${statut || null},
        notes = ${notes || null}
      WHERE id = ${id}
      RETURNING *
    `
    if (result.length === 0) {
      return NextResponse.json({ error: "Membre not found" }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating membre:", error)
    return NextResponse.json({ error: "Failed to update membre" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await sql`DELETE FROM membres WHERE id = ${id} RETURNING id`
    if (result.length === 0) {
      return NextResponse.json({ error: "Membre not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Membre deleted" })
  } catch (error) {
    console.error("Error deleting membre:", error)
    return NextResponse.json({ error: "Failed to delete membre" }, { status: 500 })
  }
}

import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM members WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error fetching member with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const {
      nom,
      prenom,
      date_naissance,
      sexe,
      adresse,
      telephone,
      email,
      profession,
      departement,
      arrondissement,
      date_adhesion,
      statut,
      notes,
    } = await request.json()

    if (!nom || !prenom) {
      return NextResponse.json({ error: "Nom and Prenom are required" }, { status: 400 })
    }

    const { rows } = await sql`
      UPDATE members
      SET
        nom = ${nom},
        prenom = ${prenom},
        date_naissance = ${date_naissance || null},
        sexe = ${sexe || null},
        adresse = ${adresse || null},
        telephone = ${telephone || null},
        email = ${email || null},
        profession = ${profession || null},
        departement = ${departement || null},
        arrondissement = ${arrondissement || null},
        date_adhesion = ${date_adhesion || null},
        statut = ${statut || "Actif"},
        notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error(`Error updating member with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rowCount } = await sql`DELETE FROM members WHERE id = ${id};`
    if (rowCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting member with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}

import { sql } from "../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        d.id,
        d.nom,
        d.code,
        d.chef_lieu,
        d.population,
        d.superficie,
        json_agg(
          json_build_object(
            'id', a.id,
            'nom', a.nom,
            'code', a.code,
            'population', a.population,
            'superficie', a.superficie
          )
        ) as arrondissements
      FROM departements d
      LEFT JOIN arrondissements a ON d.id = a.departement_id
      GROUP BY d.id, d.nom, d.code, d.chef_lieu, d.population, d.superficie
      ORDER BY d.nom
    `

    const departements = result.rows.map(row => ({
      id: row.id,
      nom: row.nom,
      code: row.code,
      chef_lieu: row.chef_lieu,
      population: row.population,
      superficie: row.superficie,
      arrondissements: row.arrondissements[0] === null ? [] : row.arrondissements
    }))

    return NextResponse.json(departements)
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des départements' },
      { status: 500 }
    )
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

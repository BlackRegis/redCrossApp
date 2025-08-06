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
        d.created_at,
        d.updated_at
      FROM departements d
      ORDER BY d.nom
    `

    const departements = result.rows.map(row => ({
      id: row.id,
      nom: row.nom,
      code: row.code,
      chef_lieu: row.chef_lieu,
      population: row.population,
      superficie: row.superficie,
      createdAt: row.created_at,
      updatedAt: row.updated_at
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
    const body = await request.json()
    
    const {
      nom,
      code,
      chef_lieu,
      population,
      superficie
    } = body

    const result = await sql`
      INSERT INTO departements (
        nom, code, chef_lieu, population, superficie
      ) VALUES (
        ${nom}, ${code}, ${chef_lieu}, ${population}, ${superficie}
      )
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Département créé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la création du département:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du département' },
      { status: 500 }
    )
  }
}

import { sql } from "../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        a.id,
        a.nom,
        a.code,
        a.departement_id,
        a.population,
        a.superficie,
        a.created_at,
        a.updated_at,
        d.nom as departement_nom
      FROM arrondissements a
      LEFT JOIN departements d ON a.departement_id = d.id
      ORDER BY d.nom, a.nom
    `

    const arrondissements = result.rows.map(row => ({
      id: row.id,
      nom: row.nom,
      code: row.code,
      departement_id: row.departement_id,
      population: row.population,
      superficie: row.superficie,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      departement_nom: row.departement_nom
    }))

    return NextResponse.json(arrondissements)
  } catch (error) {
    console.error('Erreur lors de la récupération des arrondissements:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des arrondissements' },
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
      departement_id,
      population,
      superficie
    } = body

    const result = await sql`
      INSERT INTO arrondissements (
        nom, code, departement_id, population, superficie
      ) VALUES (
        ${nom}, ${code}, ${departement_id}, ${population}, ${superficie}
      )
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Arrondissement créé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la création de l\'arrondissement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'arrondissement' },
      { status: 500 }
    )
  }
} 
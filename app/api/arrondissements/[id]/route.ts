import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
      WHERE a.id = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Arrondissement non trouvé' },
        { status: 404 }
      )
    }

    const arrondissement = result.rows[0]
    return NextResponse.json({
      id: arrondissement.id,
      nom: arrondissement.nom,
      code: arrondissement.code,
      departement_id: arrondissement.departement_id,
      population: arrondissement.population,
      superficie: arrondissement.superficie,
      createdAt: arrondissement.created_at,
      updatedAt: arrondissement.updated_at,
      departement_nom: arrondissement.departement_nom
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'arrondissement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'arrondissement' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const {
      nom,
      code,
      departement_id,
      population,
      superficie
    } = body

    await sql`
      UPDATE arrondissements 
      SET nom = ${nom}, code = ${code}, departement_id = ${departement_id}, 
          population = ${population}, superficie = ${superficie}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Arrondissement mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'arrondissement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'arrondissement' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await sql`
      DELETE FROM arrondissements WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Arrondissement supprimé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'arrondissement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'arrondissement' },
      { status: 500 }
    )
  }
}

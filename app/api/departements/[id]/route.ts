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
        d.id,
        d.nom,
        d.code,
        d.chef_lieu,
        d.population,
        d.superficie,
        d.created_at,
        d.updated_at
      FROM departements d
      WHERE d.id = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Département non trouvé' },
        { status: 404 }
      )
    }

    const departement = result.rows[0]
    return NextResponse.json({
      id: departement.id,
      nom: departement.nom,
      code: departement.code,
      chef_lieu: departement.chef_lieu,
      population: departement.population,
      superficie: departement.superficie,
      createdAt: departement.created_at,
      updatedAt: departement.updated_at
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du département:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du département' },
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
      chef_lieu,
      population,
      superficie
    } = body

    await sql`
      UPDATE departements 
      SET nom = ${nom}, code = ${code}, chef_lieu = ${chef_lieu}, 
          population = ${population}, superficie = ${superficie}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Département mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du département:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du département' },
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
      DELETE FROM departements WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Département supprimé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du département:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du département' },
      { status: 500 }
    )
  }
}

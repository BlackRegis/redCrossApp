import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Récupérer le bureau avec ses membres
    const result = await sql`
      SELECT 
        b.id,
        b.nom,
        b.type,
        b.niveau,
        b.description,
        bm.id as membre_id,
        bm.poste,
        bm.date_nomination,
        bm.date_fin_mandat,
        m.id as membre_membre_id,
        m.nom as membre_nom,
        m.prenom as membre_prenom,
        m.email as membre_email,
        m.telephone as membre_telephone,
        d.nom as departement_nom,
        a.nom as arrondissement_nom
      FROM bureaux_executifs b
      LEFT JOIN bureau_membres bm ON b.id = bm.bureau_id
      LEFT JOIN membres m ON bm.membre_id = m.id
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
      WHERE b.id = ${id}
      ORDER BY bm.poste, m.nom
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bureau non trouvé' },
        { status: 404 }
      )
    }

    // Transformer les données
    const bureauData = result.rows[0]
    const bureau = {
      id: bureauData.id,
      nom: bureauData.nom,
      type: bureauData.type,
      niveau: bureauData.niveau,
      description: bureauData.description,
      membres: result.rows
        .filter(row => row.membre_id) // Filtrer les membres existants
        .map(row => ({
          id: row.membre_id,
          membre_id: row.membre_membre_id,
          membre: {
            id: row.membre_membre_id,
            nom: row.membre_nom,
            prenom: row.membre_prenom,
            email: row.membre_email,
            telephone: row.membre_telephone,
            departement: row.departement_nom,
            arrondissement: row.arrondissement_nom
          },
          poste: row.poste,
          dateNomination: row.date_nomination,
          mandatFin: row.date_fin_mandat
        }))
    }

    return NextResponse.json(bureau)
  } catch (error) {
    console.error('Erreur lors de la récupération du bureau:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du bureau' },
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
    
    const { nom, niveau, description, membres } = body

    // Mettre à jour les informations du bureau
    await sql`
      UPDATE bureaux_executifs 
      SET nom = ${nom}, niveau = ${niveau}, description = ${description || null}
      WHERE id = ${id}
    `

    // Supprimer tous les membres existants
    await sql`
      DELETE FROM bureau_membres WHERE bureau_id = ${id}
    `

    // Ajouter les nouveaux membres
    for (const membre of membres) {
      // Ajouter le membre au bureau
      await sql`
        INSERT INTO bureau_membres (
          bureau_id, membre_id, poste, date_nomination, date_fin_mandat
        ) VALUES (
          ${id}, ${membre.membre_id}, ${membre.poste}, ${membre.dateNomination}, ${membre.mandatFin}
        )
      `
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bureau mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bureau:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du bureau' },
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

    // Supprimer les membres du bureau
    await sql`
      DELETE FROM bureau_membres WHERE bureau_id = ${id}
    `

    // Supprimer le bureau
    await sql`
      DELETE FROM bureaux_executifs WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Bureau supprimé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du bureau:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du bureau' },
      { status: 500 }
    )
  }
} 
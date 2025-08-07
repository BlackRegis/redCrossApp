import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await sql`
      SELECT 
        m.id,
        m.nom,
        m.prenom,
        m.email,
        m.telephone,
        m.adresse,
        m.profession,
        m.date_naissance,
        m.sexe,
        m.date_adhesion,
        m.statut,
        m.numero_carte,
        m.notes,
        d.nom as departement_nom,
        d.id as departement_id,
        a.nom as arrondissement_nom,
        a.id as arrondissement_id,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, m.date_naissance)) as age
      FROM membres m
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
      WHERE m.id = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const membre = {
      id: row.id,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone,
      adresse: row.adresse,
      profession: row.profession,
      dateNaissance: row.date_naissance,
      sexe: row.sexe === 'homme' ? 'M' : row.sexe === 'femme' ? 'F' : row.sexe,
      dateAdhesion: row.date_adhesion,
      statut: row.statut,
      numeroCarte: row.numero_carte,
      notes: row.notes,
      departement: row.departement_nom,
      departementId: row.departement_id,
      arrondissement: row.arrondissement_nom,
      arrondissementId: row.arrondissement_id,
      age: row.age ? parseInt(row.age) : null
    }

    return NextResponse.json(membre)
  } catch (error) {
    console.error('Erreur lors de la récupération du membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du membre' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const {
      nom,
      prenom,
      date_naissance,
      sexe,
      adresse,
      telephone,
      email,
      profession,
      departement_id,
      arrondissement_id,
      date_adhesion,
      statut,
      numero_carte,
      notes
    } = body

    const result = await sql`
      UPDATE membres SET
        nom = ${nom},
        prenom = ${prenom},
        date_naissance = ${date_naissance},
        sexe = ${sexe},
        adresse = ${adresse},
        telephone = ${telephone},
        email = ${email},
        profession = ${profession},
        departement_id = ${departement_id},
        arrondissement_id = ${arrondissement_id},
        date_adhesion = ${date_adhesion},
        statut = ${statut},
        numero_carte = ${numero_carte},
        notes = ${notes}
      WHERE id = ${id}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Membre mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du membre' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM membres WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Membre supprimé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du membre' },
      { status: 500 }
    )
  }
}

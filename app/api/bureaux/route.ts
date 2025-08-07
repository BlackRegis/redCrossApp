import { sql } from "../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        be.id,
        be.nom,
        be.type,
        be.niveau,
        be.description,
        be.statut,
        be.created_at,
        be.updated_at,
        d.nom as departement_nom,
        a.nom as arrondissement_nom,
        json_agg(
          json_build_object(
            'id', bm.id,
            'membre_id', bm.membre_id,
            'poste', bm.poste,
            'date_nomination', bm.date_nomination,
            'date_fin_mandat', bm.date_fin_mandat,
            'statut', bm.statut,
            'notes', bm.notes,
            'membre_nom', m.nom,
            'membre_prenom', m.prenom,
            'membre_email', m.email,
            'membre_telephone', m.telephone
          ) ORDER BY 
            CASE bm.poste 
              WHEN 'Président' THEN 1
              WHEN 'Vice-Président' THEN 2
              WHEN 'Secrétaire Général' THEN 3
              WHEN 'Secrétaire Adjoint' THEN 4
              WHEN 'Trésorier' THEN 5
              WHEN 'Trésorier Adjoint' THEN 6
              WHEN 'Commissaire aux Comptes' THEN 7
              WHEN 'Membre' THEN 8
              ELSE 9
            END
        ) FILTER (WHERE bm.id IS NOT NULL) as membres
      FROM bureaux_executifs be
      LEFT JOIN departements d ON be.departement_id = d.id
      LEFT JOIN arrondissements a ON be.arrondissement_id = a.id
      LEFT JOIN bureau_membres bm ON be.id = bm.bureau_id
      LEFT JOIN membres m ON bm.membre_id = m.id
      GROUP BY be.id, be.nom, be.type, be.niveau, be.description, be.statut, be.created_at, be.updated_at, d.nom, a.nom
      ORDER BY 
        CASE be.type 
          WHEN 'nation' THEN 1
          WHEN 'departement' THEN 2
          WHEN 'arrondissement' THEN 3
        END,
        be.nom
    `

    const bureaux = result.rows.map(row => ({
      id: row.id,
      nom: row.nom,
      type: row.type,
      niveau: row.niveau,
      description: row.description,
      statut: row.statut,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      departement: row.departement_nom,
      arrondissement: row.arrondissement_nom,
      membres: row.membres || []
    }))

    return NextResponse.json(bureaux)
  } catch (error) {
    console.error('Erreur lors de la récupération des bureaux:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bureaux' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      nom,
      type,
      niveau,
      departement_id,
      arrondissement_id,
      description,
      membres
    } = body

    // Créer le bureau exécutif
    const bureauResult = await sql`
      INSERT INTO bureaux_executifs (
        nom, type, niveau, departement_id, arrondissement_id, description
      ) VALUES (
        ${nom}, ${type}, ${niveau}, ${departement_id}, ${arrondissement_id}, ${description}
      )
      RETURNING id
    `

    const bureauId = bureauResult.rows[0].id

    // Ajouter les membres du bureau
    if (membres && membres.length > 0) {
      for (const membre of membres) {
        await sql`
          INSERT INTO bureau_membres (
            bureau_id, membre_id, poste, date_nomination, date_fin_mandat, notes
          ) VALUES (
            ${bureauId}, ${membre.membre_id}, ${membre.poste}, 
            ${membre.date_nomination}, ${membre.date_fin_mandat}, ${membre.notes || null}
          )
        `
      }
    }

    return NextResponse.json({ 
      success: true, 
      id: bureauId,
      message: 'Bureau exécutif créé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la création du bureau:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du bureau' },
      { status: 500 }
    )
  }
} 
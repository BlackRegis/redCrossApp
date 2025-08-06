import { sql } from "../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
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
        a.nom as arrondissement_nom,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, m.date_naissance)) as age
      FROM membres m
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
      ORDER BY m.nom, m.prenom
    `

    const membres = result.rows.map(row => ({
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
      arrondissement: row.arrondissement_nom,
      age: row.age ? parseInt(row.age) : null
    }))

    return NextResponse.json(membres)
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
      INSERT INTO membres (
        nom, prenom, date_naissance, sexe, adresse, telephone, email, profession,
        departement_id, arrondissement_id, date_adhesion, statut, numero_carte, notes
      ) VALUES (
        ${nom}, ${prenom}, ${date_naissance}, ${sexe}, ${adresse}, ${telephone}, 
        ${email}, ${profession}, ${departement_id}, ${arrondissement_id}, 
        ${date_adhesion}, ${statut}, ${numero_carte}, ${notes}
      )
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Membre créé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du membre' },
      { status: 500 }
    )
  }
} 
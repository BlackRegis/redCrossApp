import { sql } from "../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Récupérer les paramètres de filtrage
    const search = searchParams.get('search') || ''
    const departement = searchParams.get('departement') || ''
    const statut = searchParams.get('statut') || ''
    const typeCarte = searchParams.get('typeCarte') || ''
    const tab = searchParams.get('tab') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Déterminer si on veut toutes les cartes (pour les statistiques) ou seulement une page
    const wantAllCartes = searchParams.get('all') === 'true' || tab === 'toutes'
    
    let result
    if (wantAllCartes) {
      // Récupérer toutes les cartes pour les statistiques
      result = await sql`
        SELECT 
          cm.id,
          cm.numero_carte,
          cm.date_emission,
          cm.date_expiration,
          cm.statut,
          cm.type_carte,
          cm.created_at,
          cm.updated_at,
          m.id as membre_id,
          m.nom,
          m.prenom,
          m.email,
          m.telephone,
          m.statut as membre_statut,
          d.nom as departement_nom,
          a.nom as arrondissement_nom,
          CASE 
            WHEN cm.date_expiration < CURRENT_DATE THEN 'Expirée'
            WHEN cm.statut = 'Suspendue' THEN 'Suspendue'
            WHEN cm.statut = 'Remplacée' THEN 'Remplacée'
            ELSE 'Active'
          END as statut_calculé
        FROM cartes_membres cm
        JOIN membres m ON cm.membre_id = m.id
        LEFT JOIN departements d ON m.departement_id = d.id
        LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
        ORDER BY cm.created_at DESC
      `
    } else {
      // Récupérer seulement une page pour l'affichage
      result = await sql`
        SELECT 
          cm.id,
          cm.numero_carte,
          cm.date_emission,
          cm.date_expiration,
          cm.statut,
          cm.type_carte,
          cm.created_at,
          cm.updated_at,
          m.id as membre_id,
          m.nom,
          m.prenom,
          m.email,
          m.telephone,
          m.statut as membre_statut,
          d.nom as departement_nom,
          a.nom as arrondissement_nom,
          CASE 
            WHEN cm.date_expiration < CURRENT_DATE THEN 'Expirée'
            WHEN cm.statut = 'Suspendue' THEN 'Suspendue'
            WHEN cm.statut = 'Remplacée' THEN 'Remplacée'
            ELSE 'Active'
          END as statut_calculé
        FROM cartes_membres cm
        JOIN membres m ON cm.membre_id = m.id
        LEFT JOIN departements d ON m.departement_id = d.id
        LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
        ORDER BY cm.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Compter le total
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM cartes_membres cm
      JOIN membres m ON cm.membre_id = m.id
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
    `

    const cartes = result.rows.map(row => ({
      id: row.id,
      numeroCarte: row.numero_carte,
      dateEmission: row.date_emission,
      dateExpiration: row.date_expiration,
      statut: row.statut,
      statutCalcule: row.statut_calculé,
      typeCarte: row.type_carte,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      membre: {
        id: row.membre_id,
        nom: row.nom,
        prenom: row.prenom,
        email: row.email,
        telephone: row.telephone,
        statut: row.membre_statut,
        departement: row.departement_nom,
        arrondissement: row.arrondissement_nom
      }
    }))

    // Filtrer côté client pour l'instant (solution temporaire)
    let filteredCartes = cartes

    // Filtre de recherche
    if (search) {
      filteredCartes = filteredCartes.filter(carte => 
        carte.numeroCarte.toLowerCase().includes(search.toLowerCase()) ||
        carte.membre.nom.toLowerCase().includes(search.toLowerCase()) ||
        carte.membre.prenom.toLowerCase().includes(search.toLowerCase()) ||
        carte.membre.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtre par département
    if (departement && departement !== 'all') {
      filteredCartes = filteredCartes.filter(carte => 
        carte.membre.departement === departement
      )
    }

    // Filtre par statut
    if (statut && statut !== 'all') {
      filteredCartes = filteredCartes.filter(carte => 
        carte.statutCalcule === statut
      )
    }

    // Filtre par type de carte
    if (typeCarte && typeCarte !== 'all') {
      filteredCartes = filteredCartes.filter(carte => 
        carte.typeCarte === typeCarte
      )
    }

    // Filtre par onglet
    if (tab && tab !== 'toutes') {
      if (tab === 'actives') {
        filteredCartes = filteredCartes.filter(carte => carte.statutCalcule === 'Active')
      } else if (tab === 'expirees') {
        filteredCartes = filteredCartes.filter(carte => carte.statutCalcule === 'Expirée')
      } else if (tab === 'suspendues') {
        filteredCartes = filteredCartes.filter(carte => carte.statutCalcule === 'Suspendue')
      }
    }

    // Pagination côté client pour l'instant
    const total = filteredCartes.length
    let finalCartes = filteredCartes
    
    // Si on ne veut pas toutes les cartes, appliquer la pagination
    if (!wantAllCartes) {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      finalCartes = filteredCartes.slice(startIndex, endIndex)
    }

    return NextResponse.json({
      cartes: finalCartes,
      pagination: {
        total,
        page: wantAllCartes ? 1 : page,
        limit: wantAllCartes ? total : limit,
        totalPages: wantAllCartes ? 1 : Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cartes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      membre_id,
      numero_carte,
      date_emission,
      date_expiration,
      statut,
      type_carte
    } = body

    const result = await sql`
      INSERT INTO cartes_membres (
        membre_id, numero_carte, date_emission, date_expiration, statut, type_carte
      ) VALUES (
        ${membre_id}, ${numero_carte}, ${date_emission}, ${date_expiration}, ${statut}, ${type_carte}
      )
      RETURNING id
    `

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Carte créée avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la création de la carte:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la carte' },
      { status: 500 }
    )
  }
} 
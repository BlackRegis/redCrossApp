import { getSqlClient } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const membre = await sql`SELECT * FROM membres WHERE id = ${id}`
    if (membre.length === 0) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 })
    }
    return NextResponse.json(membre[0])
  } catch (error) {
    console.error("Erreur lors de la récupération du membre:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params
  const body = await request.json()
  const {
    nom,
    prenom,
    date_naissance,
    lieu_naissance,
    sexe,
    nationalite,
    adresse,
    telephone,
    email,
    profession,
    type_adhesion,
    statut,
    notes,
    date_adhesion,
    numero_carte,
    photo,
    situation_matrimoniale,
    nombre_enfants,
    niveau_etude,
    competences,
    langues,
    est_membre_bureau,
    poste_bureau,
    niveau_bureau,
    date_nomination_bureau,
    mandat_fin_bureau,
  } = body

  try {
    const updatedMembre = await sql`
      UPDATE membres
      SET
        nom = ${nom},
        prenom = ${prenom},
        date_naissance = ${date_naissance},
        lieu_naissance = ${lieu_naissance},
        sexe = ${sexe},
        nationalite = ${nationalite},
        adresse = ${adresse},
        telephone = ${telephone},
        email = ${email},
        profession = ${profession},
        type_adhesion = ${type_adhesion},
        statut = ${statut},
        notes = ${notes},
        date_adhesion = ${date_adhesion},
        numero_carte = ${numero_carte},
        photo = ${photo},
        situation_matrimoniale = ${situation_matrimoniale},
        nombre_enfants = ${nombre_enfants},
        niveau_etude = ${niveau_etude},
        competences = ${competences},
        langues = ${langues},
        est_membre_bureau = ${est_membre_bureau},
        poste_bureau = ${poste_bureau},
        niveau_bureau = ${niveau_bureau},
        date_nomination_bureau = ${date_nomination_bureau},
        mandat_fin_bureau = ${mandat_fin_bureau}
      WHERE id = ${id}
      RETURNING *
    `
    if (updatedMembre.length === 0) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 })
    }
    return NextResponse.json(updatedMembre[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour du membre:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const deletedMembre = await sql`
      DELETE FROM membres
      WHERE id = ${id}
      RETURNING *
    `
    if (deletedMembre.length === 0) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 })
    }
    return NextResponse.json({ message: "Membre supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du membre:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

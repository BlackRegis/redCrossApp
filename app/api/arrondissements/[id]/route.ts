import { getSqlClient } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const arrondissement = await sql`SELECT * FROM arrondissements WHERE id = ${id}`
    if (arrondissement.length === 0) {
      return NextResponse.json({ error: "Arrondissement non trouvé" }, { status: 404 })
    }
    return NextResponse.json(arrondissement[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de l'arrondissement:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params
  const body = await request.json()
  const { nom, code, population, superficie, departement_id } = body

  try {
    const updatedArrondissement = await sql`
      UPDATE arrondissements
      SET nom = ${nom}, code = ${code}, population = ${population}, superficie = ${superficie}, departement_id = ${departement_id}
      WHERE id = ${id}
      RETURNING *
    `
    if (updatedArrondissement.length === 0) {
      return NextResponse.json({ error: "Arrondissement non trouvé" }, { status: 404 })
    }
    return NextResponse.json(updatedArrondissement[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'arrondissement:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const deletedArrondissement = await sql`
      DELETE FROM arrondissements
      WHERE id = ${id}
      RETURNING *
    `
    if (deletedArrondissement.length === 0) {
      return NextResponse.json({ error: "Arrondissement non trouvé" }, { status: 404 })
    }
    return NextResponse.json({ message: "Arrondissement supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'arrondissement:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

import { getSqlClient } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const departement = await sql`SELECT * FROM departements WHERE id = ${id}`
    if (departement.length === 0) {
      return NextResponse.json({ error: "Département non trouvé" }, { status: 404 })
    }
    return NextResponse.json(departement[0])
  } catch (error) {
    console.error("Erreur lors de la récupération du département:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params
  const body = await request.json()
  const { nom, code, population, superficie, chef_lieu } = body

  try {
    const updatedDepartement = await sql`
      UPDATE departements
      SET nom = ${nom}, code = ${code}, population = ${population}, superficie = ${superficie}, chef_lieu = ${chef_lieu}
      WHERE id = ${id}
      RETURNING *
    `
    if (updatedDepartement.length === 0) {
      return NextResponse.json({ error: "Département non trouvé" }, { status: 404 })
    }
    return NextResponse.json(updatedDepartement[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour du département:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sql = getSqlClient()
  const { id } = params

  try {
    const deletedDepartement = await sql`
      DELETE FROM departements
      WHERE id = ${id}
      RETURNING *
    `
    if (deletedDepartement.length === 0) {
      return NextResponse.json({ error: "Département non trouvé" }, { status: 404 })
    }
    return NextResponse.json({ message: "Département supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du département:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

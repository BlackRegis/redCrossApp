import { type NextRequest, NextResponse } from "next/server"
import { createDepartement, fetchDepartements, deleteDepartement } from "@/lib/database"

export async function GET() {
  try {
    const departements = await fetchDepartements()
    return NextResponse.json(departements)
  } catch (error) {
    console.error("API Error: Failed to fetch departements.", error)
    return NextResponse.json({ message: "Failed to fetch departements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const departement = await request.json()
    const result = await createDepartement(departement)

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    const result = await deleteDepartement(id)

    if (result.success) {
      return NextResponse.json({ message: "Département supprimé avec succès" })
    } else {
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { fetchArrondissements } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const departementId = Number.parseInt(params.id)
  if (isNaN(departementId)) {
    return NextResponse.json({ message: "Invalid Departement ID" }, { status: 400 })
  }

  try {
    const arrondissements = await fetchArrondissements(departementId)
    return NextResponse.json(arrondissements)
  } catch (error) {
    console.error(`API Error: Failed to fetch arrondissements for departement ${departementId}.`, error)
    return NextResponse.json({ message: "Failed to fetch arrondissements" }, { status: 500 })
  }
}

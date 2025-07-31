import { type NextRequest, NextResponse } from "next/server"
import { getMembreDetails } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const membre = await getMembreDetails(params.id)

    if (!membre) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 })
    }

    return NextResponse.json(membre)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

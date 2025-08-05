import { type NextRequest, NextResponse } from "next/server"
import { updateArrondissement } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const arrondissement = await request.json()
    const result = await updateArrondissement(params.id, arrondissement)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

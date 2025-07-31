import { type NextRequest, NextResponse } from "next/server"
import { saveAppSettings, getAppSettings } from "@/lib/database"

export async function GET() {
  try {
    const settings = await getAppSettings()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()
    const result = await saveAppSettings(settings)

    if (result.success) {
      return NextResponse.json({ message: "Paramètres sauvegardés avec succès" })
    } else {
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

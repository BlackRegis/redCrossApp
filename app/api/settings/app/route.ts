import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Récupérer les paramètres de l'application depuis la base de données
    // Pour l'instant, retourner des valeurs par défaut
    const defaultSettings = {
      nom_organisation: "Croix Rouge Congo",
      sigle: "CRC",
      adresse_siege: "Brazzaville, République du Congo",
      telephone: "+242 06 123 4567",
      email: "contact@croixrouge.cg",
      site_web: "https://www.croixrouge.cg",
      description: "Organisation humanitaire de la Croix Rouge au Congo",
      couleur_primaire: "#DC2626",
      couleur_secondaire: "#1F2937"
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await request.json()
    
    // Pour l'instant, juste retourner un succès
    // Dans une vraie application, vous sauvegarderiez dans une table settings
    console.log('Paramètres mis à jour:', body)

    return NextResponse.json({ 
      success: true, 
      message: 'Paramètres mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    )
  }
}

import { sql } from "../../../../lib/db"
import { NextResponse } from "next/server"

// Fonction pour créer la table settings si elle n'existe pas
async function ensureSettingsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        nom_organisation VARCHAR(255) NOT NULL DEFAULT 'Croix Rouge Congo',
        sigle VARCHAR(50) NOT NULL DEFAULT 'CRC',
        adresse_siege TEXT NOT NULL DEFAULT 'Brazzaville, République du Congo',
        telephone VARCHAR(50) NOT NULL DEFAULT '+242 06 123 4567',
        email VARCHAR(255) NOT NULL DEFAULT 'contact@croixrouge.cg',
        site_web VARCHAR(255) NOT NULL DEFAULT 'https://www.croixrouge.cg',
        description TEXT NOT NULL DEFAULT 'Organisation humanitaire de la Croix Rouge au Congo',
        couleur_primaire VARCHAR(7) NOT NULL DEFAULT '#DC2626',
        couleur_secondaire VARCHAR(7) NOT NULL DEFAULT '#1F2937',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insérer les paramètres par défaut s'ils n'existent pas
    const existingSettings = await sql`SELECT COUNT(*) as count FROM app_settings`
    if (existingSettings.rows[0].count === '0') {
      await sql`
        INSERT INTO app_settings (
          nom_organisation, sigle, adresse_siege, telephone, email, 
          site_web, description, couleur_primaire, couleur_secondaire
        ) VALUES (
          'Croix Rouge Congo', 'CRC', 'Brazzaville, République du Congo', 
          '+242 06 123 4567', 'contact@croixrouge.cg', 'https://www.croixrouge.cg',
          'Organisation humanitaire de la Croix Rouge au Congo', '#DC2626', '#1F2937'
        )
      `
    }
  } catch (error) {
    console.error('Erreur lors de la création de la table settings:', error)
  }
}

export async function GET() {
  try {
    await ensureSettingsTable()
    
    // Récupérer les paramètres de l'application depuis la base de données
    const result = await sql`SELECT * FROM app_settings ORDER BY id DESC LIMIT 1`
    
    if (result.rows.length === 0) {
      // Retourner des valeurs par défaut si aucun paramètre n'est trouvé
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
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    await ensureSettingsTable()
    
    // Mettre à jour les paramètres dans la base de données
    const result = await sql`
      UPDATE app_settings 
      SET 
        nom_organisation = ${body.nom_organisation},
        sigle = ${body.sigle},
        adresse_siege = ${body.adresse_siege},
        telephone = ${body.telephone},
        email = ${body.email},
        site_web = ${body.site_web},
        description = ${body.description},
        couleur_primaire = ${body.couleur_primaire},
        couleur_secondaire = ${body.couleur_secondaire},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM app_settings ORDER BY id DESC LIMIT 1)
      RETURNING *
    `
    
    if (result.rows.length === 0) {
      // Si aucun enregistrement n'existe, en créer un nouveau
      const insertResult = await sql`
        INSERT INTO app_settings (
          nom_organisation, sigle, adresse_siege, telephone, email, 
          site_web, description, couleur_primaire, couleur_secondaire
        ) VALUES (
          ${body.nom_organisation}, ${body.sigle}, ${body.adresse_siege}, 
          ${body.telephone}, ${body.email}, ${body.site_web}, 
          ${body.description}, ${body.couleur_primaire}, ${body.couleur_secondaire}
        ) RETURNING *
      `
      return NextResponse.json({ 
        success: true, 
        message: 'Paramètres créés avec succès',
        data: insertResult.rows[0]
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Paramètres mis à jour avec succès',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    )
  }
}

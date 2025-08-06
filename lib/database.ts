import { sql } from "./db"

// Fonctions pour les paramètres d'application
export async function saveAppSettings(settings: any) {
  try {
    await sql`
      INSERT INTO app_settings (
        nom_organisation, sigle, adresse_siege, telephone, email, site_web, 
        description, couleur_primaire, couleur_secondaire, updated_at
      ) VALUES (
        ${settings.nomOrganisation}, ${settings.sigle}, ${settings.adresseSiege}, 
        ${settings.telephone}, ${settings.email}, ${settings.siteWeb}, 
        ${settings.description}, ${settings.couleurPrimaire}, ${settings.couleurSecondaire}, 
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        nom_organisation = ${settings.nomOrganisation},
        sigle = ${settings.sigle},
        adresse_siege = ${settings.adresseSiege},
        telephone = ${settings.telephone},
        email = ${settings.email},
        site_web = ${settings.siteWeb},
        description = ${settings.description},
        couleur_primaire = ${settings.couleurPrimaire},
        couleur_secondaire = ${settings.couleurSecondaire},
        updated_at = NOW()
    `
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres:", error)
    return { success: false, error }
  }
}

export async function getAppSettings() {
  try {
    const result = await sql`SELECT * FROM app_settings LIMIT 1`
    return result.rows[0] || null
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error)
    return null
  }
}

// Fonctions pour les paramètres du pays
export async function savePaysSettings(settings: any) {
  try {
    await sql`
      INSERT INTO pays_settings (
        nom_pays, code_pays, capitale, langue, monnaie, code_monnaie, 
        fuseau_horaire, prefixe_telephone, updated_at
      ) VALUES (
        ${settings.nomPays}, ${settings.codePays}, ${settings.capitale}, 
        ${settings.langue}, ${settings.monnaie}, ${settings.codeMonnaie}, 
        ${settings.fuseauHoraire}, ${settings.prefixeTelephone}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        nom_pays = ${settings.nomPays},
        code_pays = ${settings.codePays},
        capitale = ${settings.capitale},
        langue = ${settings.langue},
        monnaie = ${settings.monnaie},
        code_monnaie = ${settings.codeMonnaie},
        fuseau_horaire = ${settings.fuseauHoraire},
        prefixe_telephone = ${settings.prefixeTelephone},
        updated_at = NOW()
    `
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres du pays:", error)
    return { success: false, error }
  }
}

// Fonctions pour les départements
export async function createDepartement(departement: any) {
  try {
    const result = await sql`
      INSERT INTO departements (nom, code, chef_lieu, population, superficie, created_at)
      VALUES (${departement.nom}, ${departement.code}, ${departement.chef_lieu}, 
              ${departement.population}, ${departement.superficie}, NOW())
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Erreur lors de la création du département:", error)
    return { success: false, error }
  }
}

export async function getDepartements() {
  try {
    const result = await sql`
      SELECT d.*, 
             COUNT(a.id) as nb_arrondissements
      FROM departements d
      LEFT JOIN arrondissements a ON d.id = a.departement_id
      GROUP BY d.id
      ORDER BY d.nom
    `
    return result.rows
  } catch (error) {
    console.error("Erreur lors de la récupération des départements:", error)
    return []
  }
}

export async function deleteDepartement(id: string) {
  try {
    // Supprimer d'abord les arrondissements
    await sql`DELETE FROM arrondissements WHERE departement_id = ${id}`
    // Puis le département
    await sql`DELETE FROM departements WHERE id = ${id}`
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression du département:", error)
    return { success: false, error }
  }
}

// Fonctions pour les arrondissements
export async function createArrondissement(arrondissement: any) {
  try {
    const result = await sql`
      INSERT INTO arrondissements (nom, code, departement_id, population, superficie, created_at)
      VALUES (${arrondissement.nom}, ${arrondissement.code}, ${arrondissement.departement_id}, 
              ${arrondissement.population}, ${arrondissement.superficie}, NOW())
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Erreur lors de la création de l'arrondissement:", error)
    return { success: false, error }
  }
}

export async function getArrondissements(departementId?: string) {
  try {
    const query = departementId
      ? sql`SELECT * FROM arrondissements WHERE departement_id = ${departementId} ORDER BY nom`
      : sql`SELECT a.*, d.nom as departement_nom FROM arrondissements a 
            JOIN departements d ON a.departement_id = d.id ORDER BY d.nom, a.nom`

    const result = await query
    return result.rows
  } catch (error) {
    console.error("Erreur lors de la récupération des arrondissements:", error)
    return []
  }
}

export async function deleteArrondissement(id: string) {
  try {
    await sql`DELETE FROM arrondissements WHERE id = ${id}`
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'arrondissement:", error)
    return { success: false, error }
  }
}

// Fonctions pour modifier les départements
export async function updateDepartement(id: string, departement: any) {
  try {
    const result = await sql`
      UPDATE departements 
      SET nom = ${departement.nom}, 
          code = ${departement.code}, 
          chef_lieu = ${departement.chef_lieu}, 
          population = ${departement.population}, 
          superficie = ${departement.superficie}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Erreur lors de la modification du département:", error)
    return { success: false, error }
  }
}

// Fonctions pour modifier les arrondissements
export async function updateArrondissement(id: string, arrondissement: any) {
  try {
    const result = await sql`
      UPDATE arrondissements 
      SET nom = ${arrondissement.nom}, 
          code = ${arrondissement.code}, 
          population = ${arrondissement.population}, 
          superficie = ${arrondissement.superficie}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Erreur lors de la modification de l'arrondissement:", error)
    return { success: false, error }
  }
}

// Fonction pour récupérer les détails d'un membre
export async function getMembreDetails(id: string) {
  try {
    const membre = await sql`
      SELECT m.*, d.nom as departement_nom, a.nom as arrondissement_nom
      FROM membres m
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
      WHERE m.id = ${id}
    `

    if (membre.rows.length === 0) return null

    // Récupérer les formations du membre
    const formations = await sql`
      SELECT * FROM formations WHERE membre_id = ${id} ORDER BY date_debut DESC
    `

    // Récupérer les activités du membre
    const activites = await sql`
      SELECT ap.*, a.titre, a.type, a.date_debut as date
      FROM activite_participants ap
      JOIN activites a ON ap.activite_id = a.id
      WHERE ap.membre_id = ${id}
      ORDER BY a.date_debut DESC
    `

    return {
      ...membre.rows[0],
      formations: formations.rows,
      activites: activites.rows,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du membre:", error)
    return null
  }
}

export { sql }

import { neon } from "@neondatabase/serverless"

// Initialize the Neon client.
// We use a singleton pattern to ensure only one client is created.
// The disableWarningInBrowsers option is set to true to suppress the security warning
// when running SQL directly from the browser, which is common in development.
const sql = neon(process.env.DATABASE_URL!, {
  disableWarningInBrowsers: true,
})

export async function fetchRedCrossColors() {
  try {
    const colors = await sql`SELECT name, hex_code FROM red_cross_colors;`
    return colors
  } catch (error) {
    console.error("Database Error: Failed to fetch Red Cross colors.", error)
    // Return a default or throw an error based on your application's needs
    return [{ name: "Red", hex_code: "#ED1C24" }] // Fallback to default red
  }
}

export async function fetchAppSettings() {
  try {
    const settings = await sql`SELECT setting_key, setting_value FROM app_settings;`
    return settings.reduce((acc: { [key: string]: string }, setting: any) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})
  } catch (error) {
    console.error("Database Error: Failed to fetch app settings.", error)
    return {}
  }
}

export async function fetchDepartements() {
  try {
    const departements = await sql`SELECT id, nom FROM departements ORDER BY nom ASC;`
    return departements
  } catch (error) {
    console.error("Database Error: Failed to fetch departements.", error)
    return []
  }
}

export async function fetchArrondissements(departementId?: number) {
  try {
    let arrondissements
    if (departementId) {
      arrondissements =
        await sql`SELECT id, nom, departement_id FROM arrondissements WHERE departement_id = ${departementId} ORDER BY nom ASC;`
    } else {
      arrondissements = await sql`SELECT id, nom, departement_id FROM arrondissements ORDER BY nom ASC;`
    }
    return arrondissements
  } catch (error) {
    console.error("Database Error: Failed to fetch arrondissements.", error)
    return []
  }
}

export async function fetchMembres(query?: string, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit
    let membres
    let totalCount

    if (query) {
      membres = await sql`
        SELECT m.*, d.nom AS departement_nom, a.nom AS arrondissement_nom
        FROM membres m
        LEFT JOIN departements d ON m.departement_id = d.id
        LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
        WHERE m.nom ILIKE ${`%${query}%`} OR m.prenom ILIKE ${`%${query}%`} OR m.email ILIKE ${`%${query}%`}
        ORDER BY m.date_adhesion DESC
        LIMIT ${limit} OFFSET ${offset};
      `
      totalCount = await sql`
        SELECT COUNT(*) FROM membres
        WHERE nom ILIKE ${`%${query}%`} OR prenom ILIKE ${`%${query}%`} OR email ILIKE ${`%${query}%`};
      `
    } else {
      membres = await sql`
        SELECT m.*, d.nom AS departement_nom, a.nom AS arrondissement_nom
        FROM membres m
        LEFT JOIN departements d ON m.departement_id = d.id
        LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
        ORDER BY m.date_adhesion DESC
        LIMIT ${limit} OFFSET ${offset};
      `
      totalCount = await sql`SELECT COUNT(*) FROM membres;`
    }

    const totalPages = Math.ceil(Number(totalCount[0].count) / limit)

    return {
      data: membres,
      totalCount: Number(totalCount[0].count),
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Database Error: Failed to fetch membres.", error)
    return { data: [], totalCount: 0, totalPages: 0, currentPage: page }
  }
}

export async function fetchMembreById(id: number) {
  try {
    const membre = await sql`
      SELECT m.*, d.nom AS departement_nom, a.nom AS arrondissement_nom
      FROM membres m
      LEFT JOIN departements d ON m.departement_id = d.id
      LEFT JOIN arrondissements a ON m.arrondissement_id = a.id
      WHERE m.id = ${id};
    `
    return membre[0]
  } catch (error) {
    console.error(`Database Error: Failed to fetch membre with ID ${id}.`, error)
    return null
  }
}

export async function createMembre(membreData: any) {
  try {
    const [newMembre] = await sql`
      INSERT INTO membres (
        nom, prenom, date_naissance, lieu_naissance, sexe, nationalite, adresse, telephone, email, profession,
        date_adhesion, statut, departement_id, arrondissement_id, photo_url, numero_carte, date_delivrance_carte, date_expiration_carte
      ) VALUES (
        ${membreData.nom}, ${membreData.prenom}, ${membreData.date_naissance}, ${membreData.lieu_naissance}, ${membreData.sexe}, ${membreData.nationalite}, ${membreData.adresse}, ${membreData.telephone}, ${membreData.email}, ${membreData.profession},
        ${membreData.date_adhesion}, ${membreData.statut}, ${membreData.departement_id}, ${membreData.arrondissement_id}, ${membreData.photo_url}, ${membreData.numero_carte}, ${membreData.date_delivrance_carte}, ${membreData.date_expiration_carte}
      )
      RETURNING *;
    `
    return newMembre
  } catch (error) {
    console.error("Database Error: Failed to create membre.", error)
    throw error
  }
}

export async function updateMembre(id: number, membreData: any) {
  try {
    const [updatedMembre] = await sql`
      UPDATE membres SET
        nom = ${membreData.nom},
        prenom = ${membreData.prenom},
        date_naissance = ${membreData.date_naissance},
        lieu_naissance = ${membreData.lieu_naissance},
        sexe = ${membreData.sexe},
        nationalite = ${membreData.nationalite},
        adresse = ${membreData.adresse},
        telephone = ${membreData.telephone},
        email = ${membreData.email},
        profession = ${membreData.profession},
        date_adhesion = ${membreData.date_adhesion},
        statut = ${membreData.statut},
        departement_id = ${membreData.departement_id},
        arrondissement_id = ${membreData.arrondissement_id},
        photo_url = ${membreData.photo_url},
        numero_carte = ${membreData.numero_carte},
        date_delivrance_carte = ${membreData.date_delivrance_carte},
        date_expiration_carte = ${membreData.date_expiration_carte}
      WHERE id = ${id}
      RETURNING *;
    `
    return updatedMembre
  } catch (error) {
    console.error(`Database Error: Failed to update membre with ID ${id}.`, error)
    throw error
  }
}

export async function deleteMembre(id: number) {
  try {
    await sql`DELETE FROM membres WHERE id = ${id};`
    return { message: "Membre deleted successfully" }
  } catch (error) {
    console.error(`Database Error: Failed to delete membre with ID ${id}.`, error)
    throw error
  }
}

export async function fetchExecutiveBureaus() {
  try {
    const bureaus = await sql`SELECT * FROM executive_bureaus ORDER BY start_date DESC;`
    return bureaus
  } catch (error) {
    console.error("Database Error: Failed to fetch executive bureaus.", error)
    return []
  }
}

export async function fetchExecutiveBureauById(id: number) {
  try {
    const bureau = await sql`SELECT * FROM executive_bureaus WHERE id = ${id};`
    return bureau[0]
  } catch (error) {
    console.error(`Database Error: Failed to fetch executive bureau with ID ${id}.`, error)
    return null
  }
}

export async function createExecutiveBureau(bureauData: any) {
  try {
    const [newBureau] = await sql`
      INSERT INTO executive_bureaus (name, start_date, end_date, is_active)
      VALUES (${bureauData.name}, ${bureauData.start_date}, ${bureauData.end_date}, ${bureauData.is_active})
      RETURNING *;
    `
    return newBureau
  } catch (error) {
    console.error("Database Error: Failed to create executive bureau.", error)
    throw error
  }
}

export async function updateExecutiveBureau(id: number, bureauData: any) {
  try {
    const [updatedBureau] = await sql`
      UPDATE executive_bureaus SET
        name = ${bureauData.name},
        start_date = ${bureauData.start_date},
        end_date = ${bureauData.end_date},
        is_active = ${bureauData.is_active}
      WHERE id = ${id}
      RETURNING *;
    `
    return updatedBureau
  } catch (error) {
    console.error(`Database Error: Failed to update executive bureau with ID ${id}.`, error)
    throw error
  }
}

export async function deleteExecutiveBureau(id: number) {
  try {
    await sql`DELETE FROM executive_bureaus WHERE id = ${id};`
    return { message: "Executive bureau deleted successfully" }
  } catch (error) {
    console.error(`Database Error: Failed to delete executive bureau with ID ${id}.`, error)
    throw error
  }
}

export async function fetchBureauMembers(bureauId?: number) {
  try {
    let members
    if (bureauId) {
      members = await sql`
        SELECT bm.*, m.nom, m.prenom, m.photo_url
        FROM bureau_members bm
        JOIN membres m ON bm.member_id = m.id
        WHERE bm.bureau_id = ${bureauId}
        ORDER BY bm.start_date DESC;
      `
    } else {
      members = await sql`
        SELECT bm.*, m.nom, m.prenom, m.photo_url
        FROM bureau_members bm
        JOIN membres m ON bm.member_id = m.id
        ORDER BY bm.start_date DESC;
      `
    }
    return members
  } catch (error) {
    console.error("Database Error: Failed to fetch bureau members.", error)
    return []
  }
}

export async function fetchBureauMemberById(id: number) {
  try {
    const member = await sql`
      SELECT bm.*, m.nom, m.prenom, m.photo_url
      FROM bureau_members bm
      JOIN membres m ON bm.member_id = m.id
      WHERE bm.id = ${id};
    `
    return member[0]
  } catch (error) {
    console.error(`Database Error: Failed to fetch bureau member with ID ${id}.`, error)
    return null
  }
}

export async function createBureauMember(memberData: any) {
  try {
    const [newMember] = await sql`
      INSERT INTO bureau_members (bureau_id, member_id, role, start_date, end_date)
      VALUES (${memberData.bureau_id}, ${memberData.member_id}, ${memberData.role}, ${memberData.start_date}, ${memberData.end_date})
      RETURNING *;
    `
    return newMember
  } catch (error) {
    console.error("Database Error: Failed to create bureau member.", error)
    throw error
  }
}

export async function updateBureauMember(id: number, memberData: any) {
  try {
    const [updatedMember] = await sql`
      UPDATE bureau_members SET
        bureau_id = ${memberData.bureau_id},
        member_id = ${memberData.member_id},
        role = ${memberData.role},
        start_date = ${memberData.start_date},
        end_date = ${memberData.end_date}
      WHERE id = ${id}
      RETURNING *;
    `
    return updatedMember
  } catch (error) {
    console.error(`Database Error: Failed to update bureau member with ID ${id}.`, error)
    throw error
  }
}

export async function deleteBureauMember(id: number) {
  try {
    await sql`DELETE FROM bureau_members WHERE id = ${id};`
    return { message: "Bureau member deleted successfully" }
  } catch (error) {
    console.error(`Database Error: Failed to delete bureau member with ID ${id}.`, error)
    throw error
  }
}

export async function fetchActivities(query?: string, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit
    let activities
    let totalCount

    if (query) {
      activities = await sql`
        SELECT * FROM activities
        WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}
        ORDER BY start_date DESC
        LIMIT ${limit} OFFSET ${offset};
      `
      totalCount = await sql`
        SELECT COUNT(*) FROM activities
        WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`};
      `
    } else {
      activities = await sql`
        SELECT * FROM activities
        ORDER BY start_date DESC
        LIMIT ${limit} OFFSET ${offset};
      `
      totalCount = await sql`SELECT COUNT(*) FROM activities;`
    }

    const totalPages = Math.ceil(Number(totalCount[0].count) / limit)

    return {
      data: activities,
      totalCount: Number(totalCount[0].count),
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Database Error: Failed to fetch activities.", error)
    return { data: [], totalCount: 0, totalPages: 0, currentPage: page }
  }
}

export async function fetchActivityById(id: number) {
  try {
    const activity = await sql`SELECT * FROM activities WHERE id = ${id};`
    return activity[0]
  } catch (error) {
    console.error(`Database Error: Failed to fetch activity with ID ${id}.`, error)
    return null
  }
}

export async function createActivity(activityData: any) {
  try {
    const [newActivity] = await sql`
      INSERT INTO activities (name, description, start_date, end_date, location, status)
      VALUES (${activityData.name}, ${activityData.description}, ${activityData.start_date}, ${activityData.end_date}, ${activityData.location}, ${activityData.status})
      RETURNING *;
    `
    return newActivity
  } catch (error) {
    console.error("Database Error: Failed to create activity.", error)
    throw error
  }
}

export async function updateActivity(id: number, activityData: any) {
  try {
    const [updatedActivity] = await sql`
      UPDATE activities SET
        name = ${activityData.name},
        description = ${activityData.description},
        start_date = ${activityData.start_date},
        end_date = ${activityData.end_date},
        location = ${activityData.location},
        status = ${activityData.status}
      WHERE id = ${id}
      RETURNING *;
    `
    return updatedActivity
  } catch (error) {
    console.error(`Database Error: Failed to update activity with ID ${id}.`, error)
    throw error
  }
}

export async function deleteActivity(id: number) {
  try {
    await sql`DELETE FROM activities WHERE id = ${id};`
    return { message: "Activity deleted successfully" }
  } catch (error) {
    console.error(`Database Error: Failed to delete activity with ID ${id}.`, error)
    throw error
  }
}

export async function fetchActivityParticipants(activityId?: number) {
  try {
    let participants
    if (activityId) {
      participants = await sql`
        SELECT ap.*, m.nom, m.prenom, m.email
        FROM activity_participants ap
        JOIN membres m ON ap.member_id = m.id
        WHERE ap.activity_id = ${activityId};
      `
    } else {
      participants = await sql`
        SELECT ap.*, m.nom, m.prenom, m.email
        FROM activity_participants ap
        JOIN membres m ON ap.member_id = m.id;
      `
    }
    return participants
  } catch (error) {
    console.error("Database Error: Failed to fetch activity participants.", error)
    return []
  }
}

export async function createActivityParticipant(participantData: any) {
  try {
    const [newParticipant] = await sql`
      INSERT INTO activity_participants (activity_id, member_id, role)
      VALUES (${participantData.activity_id}, ${participantData.member_id}, ${participantData.role})
      RETURNING *;
    `
    return newParticipant
  } catch (error) {
    console.error("Database Error: Failed to create activity participant.", error)
    throw error
  }
}

export async function deleteActivityParticipant(id: number) {
  try {
    await sql`DELETE FROM activity_participants WHERE id = ${id};`
    return { message: "Activity participant deleted successfully" }
  } catch (error) {
    console.error(`Database Error: Failed to delete activity participant with ID ${id}.`, error)
    throw error
  }
}

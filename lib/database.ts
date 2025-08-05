import { sql } from "@vercel/postgres"

export async function fetchAppSettings() {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM app_settings;`
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value
      return acc
    }, {})
    return settings
  } catch (error) {
    console.error("Database Error: Failed to fetch app settings.", error)
    throw new Error("Failed to fetch app settings.")
  }
}

export async function updateAppSetting(key: string, value: string) {
  try {
    const { rowCount } = await sql`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES (${key}, ${value})
      ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP;
    `
    return rowCount > 0
  } catch (error) {
    console.error("Database Error: Failed to update app setting.", error)
    throw new Error("Failed to update app setting.")
  }
}

export async function fetchDepartments() {
  try {
    const { rows } = await sql`SELECT * FROM departments ORDER BY name ASC;`
    return rows
  } catch (error) {
    console.error("Database Error: Failed to fetch departments.", error)
    throw new Error("Failed to fetch departments.")
  }
}

export async function addDepartment(name: string) {
  try {
    const { rows } = await sql`
      INSERT INTO departments (name)
      VALUES (${name})
      RETURNING *;
    `
    return rows[0]
  } catch (error) {
    console.error("Database Error: Failed to add department.", error)
    throw new Error("Failed to add department.")
  }
}

export async function deleteDepartment(id: number) {
  try {
    const { rowCount } = await sql`DELETE FROM departments WHERE id = ${id};`
    return rowCount > 0
  } catch (error) {
    console.error("Database Error: Failed to delete department.", error)
    throw new Error("Failed to delete department.")
  }
}

export async function fetchArrondissements() {
  try {
    const { rows } = await sql`SELECT * FROM arrondissements ORDER BY name ASC;`
    return rows
  } catch (error) {
    console.error("Database Error: Failed to fetch arrondissements.", error)
    throw new Error("Failed to fetch arrondissements.")
  }
}

export async function addArrondissement(department_id: number, name: string, population: number | null) {
  try {
    const { rows } = await sql`
      INSERT INTO arrondissements (department_id, name, population)
      VALUES (${department_id}, ${name}, ${population})
      RETURNING *;
    `
    return rows[0]
  } catch (error) {
    console.error("Database Error: Failed to add arrondissement.", error)
    throw new Error("Failed to add arrondissement.")
  }
}

export async function deleteArrondissement(id: number) {
  try {
    const { rowCount } = await sql`DELETE FROM arrondissements WHERE id = ${id};`
    return rowCount > 0
  } catch (error) {
    console.error("Database Error: Failed to delete arrondissement.", error)
    throw new Error("Failed to delete arrondissement.")
  }
}

export async function fetchMembers() {
  try {
    const { rows } = await sql`SELECT * FROM members ORDER BY last_name ASC;`
    return rows
  } catch (error) {
    console.error("Database Error: Failed to fetch members.", error)
    throw new Error("Failed to fetch members.")
  }
}

export async function fetchMemberById(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM members WHERE id = ${id};`
    return rows[0]
  } catch (error) {
    console.error("Database Error: Failed to fetch member by ID.", error)
    throw new Error("Failed to fetch member by ID.")
  }
}

export async function addMember(memberData: any) {
  try {
    const { rows } = await sql`
      INSERT INTO members (
        first_name, last_name, date_of_birth, place_of_birth, nationality, address,
        phone, email, profession, blood_group, allergies, medical_history,
        emergency_contact_name, emergency_contact_phone,
        membership_date, membership_type, department, arrondissement, status
      ) VALUES (
        ${memberData.first_name}, ${memberData.last_name}, ${memberData.date_of_birth}, ${memberData.place_of_birth}, ${memberData.nationality}, ${memberData.address},
        ${memberData.phone}, ${memberData.email}, ${memberData.profession}, ${memberData.blood_group}, ${memberData.allergies}, ${memberData.medical_history},
        ${memberData.emergency_contact_name}, ${memberData.emergency_contact_phone},
        ${memberData.membership_date}, ${memberData.membership_type}, ${memberData.department}, ${memberData.arrondissement}, ${memberData.status}
      )
      RETURNING *;
    `
    return rows[0]
  } catch (error) {
    console.error("Database Error: Failed to add member.", error)
    throw new Error("Failed to add member.")
  }
}

export async function updateMember(id: string, memberData: any) {
  try {
    const { rowCount } = await sql`
      UPDATE members SET
        first_name = ${memberData.first_name},
        last_name = ${memberData.last_name},
        date_of_birth = ${memberData.date_of_birth},
        place_of_birth = ${memberData.place_of_birth},
        nationality = ${memberData.nationality},
        address = ${memberData.address},
        phone = ${memberData.phone},
        email = ${memberData.email},
        profession = ${memberData.profession},
        blood_group = ${memberData.blood_group},
        allergies = ${memberData.allergies},
        medical_history = ${memberData.medical_history},
        emergency_contact_name = ${memberData.emergency_contact_name},
        emergency_contact_phone = ${memberData.emergency_contact_phone},
        membership_date = ${memberData.membership_date},
        membership_type = ${memberData.membership_type},
        department = ${memberData.department},
        arrondissement = ${memberData.arrondissement},
        status = ${memberData.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `
    return rowCount > 0
  } catch (error) {
    console.error("Database Error: Failed to update member.", error)
    throw new Error("Failed to update member.")
  }
}

export async function deleteMember(id: string) {
  try {
    const { rowCount } = await sql`DELETE FROM members WHERE id = ${id};`
    return rowCount > 0
  } catch (error) {
    console.error("Database Error: Failed to delete member.", error)
    throw new Error("Failed to delete member.")
  }
}

import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rows } = await sql`SELECT * FROM members WHERE id = ${id};`
    if (rows.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching member by ID:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const memberData = await request.json()

    const { rowCount } = await sql`
      UPDATE members SET
        first_name = COALESCE(${memberData.first_name}, first_name),
        last_name = COALESCE(${memberData.last_name}, last_name),
        date_of_birth = COALESCE(${memberData.date_of_birth}, date_of_birth),
        place_of_birth = COALESCE(${memberData.place_of_birth}, place_of_birth),
        nationality = COALESCE(${memberData.nationality}, nationality),
        address = COALESCE(${memberData.address}, address),
        phone = COALESCE(${memberData.phone}, phone),
        email = COALESCE(${memberData.email}, email),
        profession = COALESCE(${memberData.profession}, profession),
        blood_group = COALESCE(${memberData.blood_group}, blood_group),
        allergies = COALESCE(${memberData.allergies}, allergies),
        medical_history = COALESCE(${memberData.medical_history}, medical_history),
        emergency_contact_name = COALESCE(${memberData.emergency_contact_name}, emergency_contact_name),
        emergency_contact_phone = COALESCE(${memberData.emergency_contact_phone}, emergency_contact_phone),
        membership_date = COALESCE(${memberData.membership_date}, membership_date),
        membership_type = COALESCE(${memberData.membership_type}, membership_type),
        department = COALESCE(${memberData.department}, department),
        arrondissement = COALESCE(${memberData.arrondissement}, arrondissement),
        status = COALESCE(${memberData.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `

    if (rowCount === 0) {
      return NextResponse.json({ error: "Member not found or no changes made" }, { status: 404 })
    }
    return NextResponse.json({ message: "Member updated successfully" })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { rowCount } = await sql`DELETE FROM members WHERE id = ${id};`
    if (rowCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Member deleted successfully" })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}

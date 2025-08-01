import { NextResponse } from "next/server"
import { fetchMembreById, updateMembre, deleteMembre } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Membre ID" }, { status: 400 })
  }

  try {
    const membre = await fetchMembreById(id)
    if (!membre) {
      return NextResponse.json({ message: "Membre not found" }, { status: 404 })
    }
    return NextResponse.json(membre)
  } catch (error) {
    console.error(`API Error: Failed to fetch membre with ID ${id}.`, error)
    return NextResponse.json({ message: "Failed to fetch membre" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Membre ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updatedMembre = await updateMembre(id, body)
    return NextResponse.json(updatedMembre)
  } catch (error: any) {
    console.error(`API Error: Failed to update membre with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to update membre" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Membre ID" }, { status: 400 })
  }

  try {
    await deleteMembre(id)
    return NextResponse.json({ message: "Membre deleted successfully" })
  } catch (error: any) {
    console.error(`API Error: Failed to delete membre with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to delete membre" }, { status: 500 })
  }
}

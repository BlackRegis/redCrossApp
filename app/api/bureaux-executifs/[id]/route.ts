import { NextResponse } from "next/server"
import { fetchExecutiveBureauById, updateExecutiveBureau, deleteExecutiveBureau } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau ID" }, { status: 400 })
  }

  try {
    const bureau = await fetchExecutiveBureauById(id)
    if (!bureau) {
      return NextResponse.json({ message: "Executive bureau not found" }, { status: 404 })
    }
    return NextResponse.json(bureau)
  } catch (error) {
    console.error(`API Error: Failed to fetch executive bureau with ID ${id}.`, error)
    return NextResponse.json({ message: "Failed to fetch executive bureau" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updatedBureau = await updateExecutiveBureau(id, body)
    return NextResponse.json(updatedBureau)
  } catch (error: any) {
    console.error(`API Error: Failed to update executive bureau with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to update executive bureau" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau ID" }, { status: 400 })
  }

  try {
    await deleteExecutiveBureau(id)
    return NextResponse.json({ message: "Executive bureau deleted successfully" })
  } catch (error: any) {
    console.error(`API Error: Failed to delete executive bureau with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to delete executive bureau" }, { status: 500 })
  }
}

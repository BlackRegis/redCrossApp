import { NextResponse } from "next/server"
import { fetchBureauMemberById, updateBureauMember, deleteBureauMember } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau Member ID" }, { status: 400 })
  }

  try {
    const member = await fetchBureauMemberById(id)
    if (!member) {
      return NextResponse.json({ message: "Bureau member not found" }, { status: 404 })
    }
    return NextResponse.json(member)
  } catch (error) {
    console.error(`API Error: Failed to fetch bureau member with ID ${id}.`, error)
    return NextResponse.json({ message: "Failed to fetch bureau member" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau Member ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updatedMember = await updateBureauMember(id, body)
    return NextResponse.json(updatedMember)
  } catch (error: any) {
    console.error(`API Error: Failed to update bureau member with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to update bureau member" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid Bureau Member ID" }, { status: 400 })
  }

  try {
    await deleteBureauMember(id)
    return NextResponse.json({ message: "Bureau member deleted successfully" })
  } catch (error: any) {
    console.error(`API Error: Failed to delete bureau member with ID ${id}.`, error)
    return NextResponse.json({ message: error.message || "Failed to delete bureau member" }, { status: 500 })
  }
}

import { sql } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const arrondissement = await sql`SELECT * FROM arrondissements WHERE id = ${id}`;
    if (arrondissement.length === 0) {
      return NextResponse.json({ message: 'Arrondissement not found' }, { status: 404 });
    }
    return NextResponse.json(arrondissement[0]);
  } catch (error) {
    console.error(`Error fetching arrondissement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, departement_id } = await req.json();
    if (!name || !departement_id) {
      return NextResponse.json({ message: 'Name and departement_id are required' }, { status: 400 });
    }
    const updatedArrondissement = await sql`
      UPDATE arrondissements
      SET name = ${name}, departement_id = ${departement_id}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;
    if (updatedArrondissement.length === 0) {
      return NextResponse.json({ message: 'Arrondissement not found for update' }, { status: 404 });
    }
    return NextResponse.json(updatedArrondissement[0]);
  } catch (error) {
    console.error(`Error updating arrondissement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM arrondissements WHERE id = ${id} RETURNING id;`;
    if (result.length === 0) {
      return NextResponse.json({ message: 'Arrondissement not found for deletion' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Arrondissement deleted successfully', id: result[0].id });
  } catch (error) {
    console.error(`Error deleting arrondissement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

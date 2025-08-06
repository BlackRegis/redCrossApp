import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const departement = await sql`SELECT * FROM departements WHERE id = ${id}`;
    if (departement.length === 0) {
      return NextResponse.json({ message: 'Departement not found' }, { status: 404 });
    }
    return NextResponse.json(departement[0]);
  } catch (error) {
    console.error(`Error fetching departement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    const updatedDepartement = await sql`
      UPDATE departements
      SET name = ${name}, description = ${description || null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;
    if (updatedDepartement.length === 0) {
      return NextResponse.json({ message: 'Departement not found for update' }, { status: 404 });
    }
    return NextResponse.json(updatedDepartement[0]);
  } catch (error) {
    console.error(`Error updating departement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM departements WHERE id = ${id} RETURNING id;`;
    if (result.length === 0) {
      return NextResponse.json({ message: 'Departement not found for deletion' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Departement deleted successfully', id: result[0].id });
  } catch (error) {
    console.error(`Error deleting departement with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

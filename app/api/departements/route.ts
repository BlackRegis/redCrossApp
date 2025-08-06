import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const departements = await sql`SELECT * FROM departements ORDER BY name ASC`;
    return NextResponse.json(departements);
  } catch (error) {
    console.error('Error fetching departements:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    const newDepartement = await sql`
      INSERT INTO departements (name, description)
      VALUES (${name}, ${description || null})
      RETURNING *;
    `;
    return NextResponse.json(newDepartement[0], { status: 201 });
  } catch (error) {
    console.error('Error creating departement:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

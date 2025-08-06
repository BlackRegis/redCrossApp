import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const membre = await sql`SELECT * FROM membres WHERE id = ${id}`;
    if (membre.length === 0) {
      return NextResponse.json({ message: 'Membre not found' }, { status: 404 });
    }
    return NextResponse.json(membre[0]);
  } catch (error) {
    console.error(`Error fetching membre with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const {
      nom, prenom, email, telephone, departement, arrondissement, statut,
      dateAdhesion, dateNaissance, age, profession, typeAdhesion, numeroCarte, sexe, adresse
    } = await req.json();

    if (!nom || !prenom || !email || !telephone || !departement || !statut) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedMembre = await sql`
      UPDATE membres
      SET
        nom = ${nom},
        prenom = ${prenom},
        email = ${email},
        telephone = ${telephone},
        departement = ${departement},
        arrondissement = ${arrondissement || null},
        statut = ${statut},
        date_adhesion = ${dateAdhesion || null},
        date_naissance = ${dateNaissance || null},
        age = ${age || null},
        profession = ${profession || null},
        type_adhesion = ${typeAdhesion || null},
        numero_carte = ${numeroCarte || null},
        sexe = ${sexe || null},
        adresse = ${adresse || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updatedMembre.length === 0) {
      return NextResponse.json({ message: 'Membre not found for update' }, { status: 404 });
    }

    return NextResponse.json(updatedMembre[0]);
  } catch (error) {
    console.error(`Error updating membre with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM membres WHERE id = ${id} RETURNING id;`;
    if (result.length === 0) {
      return NextResponse.json({ message: 'Membre not found for deletion' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Membre deleted successfully', id: result[0].id });
  } catch (error) {
    console.error(`Error deleting membre with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

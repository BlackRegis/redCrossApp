import { sql } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await sql`SELECT * FROM app_settings LIMIT 1`;
    if (settings.length === 0) {
      return NextResponse.json({ message: 'App settings not found' }, { status: 404 });
    }
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { app_name, app_description, contact_email, contact_phone, address, logo_url } = await req.json();

    // In a real application, you'd want to ensure only authorized users can update settings.
    // For simplicity, we're updating the first (and likely only) row.
    const updatedSettings = await sql`
      UPDATE app_settings
      SET
        app_name = ${app_name},
        app_description = ${app_description},
        contact_email = ${contact_email},
        contact_phone = ${contact_phone},
        address = ${address},
        logo_url = ${logo_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM app_settings LIMIT 1)
      RETURNING *;
    `;

    if (updatedSettings.length === 0) {
      return NextResponse.json({ message: 'App settings not found for update' }, { status: 404 });
    }

    return NextResponse.json(updatedSettings[0]);
  } catch (error) {
    console.error('Error updating app settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

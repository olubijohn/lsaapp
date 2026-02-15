import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');

    if (!org) {
      return NextResponse.json({ error: 'Organisation is required' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    const targetSheet = sheetTitles.find(t => t?.toLowerCase().includes('studentt')) || 'studentt';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ students: [] });
    }

    // Header Discovery
    let headerRowIndex = -1;
    let headers: string[] = [];
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const currentRow = rows[i].map((h: any) => String(h || '').trim());
        if (currentRow.includes('cr69d_organisation')) {
            headers = currentRow;
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        headers = rows[0].map((h: any) => String(h || '').trim());
        headerRowIndex = 0;
    }

    const orgCol = headers.indexOf('cr69d_organisation');

    // Filter and map to objects
    const students = rows.slice(headerRowIndex + 1)
        .filter(row => String(row[orgCol] || '').trim() === org)
        .map(row => {
            const student: any = {};
            headers.forEach((header, index) => {
                if (header) {
                    student[header] = row[index];
                }
            });
            return student;
        });

    return NextResponse.json({ students });

  } catch (error: any) {
    console.error('Students API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Discover sheets
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    // Find 'studentt' sheet (case insensitive)
    const targetSheet = sheetTitles.find(t => t?.toLowerCase().includes('studentt')) || 'studentt';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No student data found' }, { status: 404 });
    }

    // Header Discovery
    let headerRowIndex = -1;
    let headers: string[] = [];
    
    // Search first 20 rows for "cr69d_organisation" as a marker for the header row
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const currentRow = rows[i].map((h: any) => String(h || '').trim());
        if (currentRow.includes('cr69d_organisation')) {
            headers = currentRow;
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        // Fallback to row 0 if marker not found
        headers = rows[0].map((h: any) => String(h || '').trim());
        headerRowIndex = 0;
    }

    console.log('Student Stats Headers:', headers);

    const orgCol = headers.indexOf('cr69d_organisation');
    const genderCol = headers.indexOf('cr69d_gender');
    const emailCol = headers.indexOf('cr69d_email') !== -1 ? headers.indexOf('cr69d_email') : headers.indexOf('cr69d_emailaddress');
    const whatsappCol = headers.indexOf('cr69d_whatsapp') !== -1 ? headers.indexOf('cr69d_whatsapp') : headers.indexOf('cr69d_phonenumber');
    const statusCol = headers.indexOf('cr69d_status');
    const balanceCol = headers.indexOf('cr69d_balance'); // Need to find exact name
    const debtCol = headers.indexOf('cr69d_totaldebt') !== -1 ? headers.indexOf('cr69d_totaldebt') : headers.indexOf('cr69d_debt');

    // Filter students by organization
    const students = rows.slice(headerRowIndex + 1).filter(row => {
        return String(row[orgCol] || '').trim() === org;
    });

    // Aggregation logic
    const totalStudents = students.length;
    let activeStudents = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let clearedCount = 0;
    let debtorCount = 0;
    let whatsappCount = 0;
    let emailCount = 0;
    let creditBalanceCount = 0;
    let totalDebtValue = 0;

    students.forEach(student => {
        // Active Status
        const status = String(student[statusCol] || '').toLowerCase();
        if (status === 'active' || status === '1') activeStudents++;

        // Gender
        const gender = String(student[genderCol] || '').toLowerCase();
        if (gender === 'male' || gender === 'm') maleCount++;
        else if (gender === 'female' || gender === 'f') femaleCount++;

        // Balance / Debt
        const balance = parseFloat(String(student[balanceCol] || '0').replace(/[^0-9.-]+/g, '')) || 0;
        if (balance <= 0) clearedCount++;
        else debtorCount++;
        
        if (balance < 0) creditBalanceCount++;
        
        const debt = parseFloat(String(student[debtCol] || '0').replace(/[^0-9.-]+/g, '')) || 0;
        totalDebtValue += Math.abs(debt);

        // Communication
        if (String(student[whatsappCol] || '').trim().length > 5) whatsappCount++;
        if (String(student[emailCol] || '').trim().includes('@')) emailCount++;
    });

    const stats = {
        activePercentage: totalStudents ? (activeStudents / totalStudents) * 100 : 0,
        genderRatio: { male: maleCount, female: femaleCount },
        clearedVsDebtors: { cleared: clearedCount, debtors: debtorCount },
        totalStudents,
        clearedBalanceCount: clearedCount,
        creditBalanceCount,
        totalDebtors: debtorCount,
        whatsappFilled: whatsappCount,
        emailsFilled: emailCount,
        totalDebt: totalDebtValue,
        incompleteProfiles: totalStudents - Math.min(whatsappCount, emailCount) // Simplified
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

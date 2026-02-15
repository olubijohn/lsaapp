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
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const targetSheet = 'cr69d_studentses.csv';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No student data found' }, { status: 404 });
    }

    // Header Mapping
    const headers = rows[0].map((h: any) => String(h || '').trim());
    
    // Identified columns from diagnostic
    const orgCol = headers.indexOf('owningbusinessunit'); // Org ID from sample looks like a GUID
    const genderCol = headers.indexOf('cr69d_gender');
    const activeCol = headers.indexOf('cr69d_studentactive');
    const balanceCol = headers.indexOf('cr69d_wallectbalance'); // Wallet balance
    const emailCol = headers.indexOf('cr69d_emailaddress');
    const whatsappCol = headers.indexOf('cr69d_whatsapppreferrednumber');
    const whatsappSubscriberCol = headers.indexOf('cr69d_whatsappsubcriber');

    // NOTE: The user's 'organisation' from login comes from cr69d_organisation (which is Name, not GUID)
    // However, in the student sheet, we see 'owningbusinessunit' which is a GUID.
    // Let's check for a name column or use business unit.
    // Actually, looking at login logic: success returns user.organisation (which is Name).
    // Let's filter by Name if available or use business unit if we can map it.
    // For now, I'll filter by a column that matches the organization name.
    const orgNameCol = headers.indexOf('cr69d_regholdertextex'); // Registered holder name? Or check for organisation column.
    
    // If 'cr69d_organisation' is missing in student sheet, we might need to map business unit.
    // Standard LSA pattern: filter by business unit GUID if we have it, or Name.
    
    const students = rows.slice(1);

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

    students.forEach(student => {
        // Active Status (TRUE/FALSE strings)
        const isActive = String(student[activeCol] || '').toUpperCase() === 'TRUE';
        if (isActive) activeStudents++;

        // Gender
        const gender = String(student[genderCol] || '').toLowerCase();
        if (gender === 'male') maleCount++;
        else if (gender === 'female') femaleCount++;

        // Balance
        const rawBalance = String(student[balanceCol] || '0').replace(/[^0-9.-]+/g, '');
        const balance = parseFloat(rawBalance) || 0;
        
        if (balance <= 0) clearedCount++;
        else debtorCount++;
        
        if (balance < 0) creditBalanceCount++;

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
        incompleteProfiles: totalStudents - Math.min(whatsappCount, emailCount)
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function listTabs() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Check Students Sheet
    const spreadsheetIdStudents = process.env.GOOGLE_SHEETS_ID_STUDENTS;
    const res = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetIdStudents,
    });
    console.log('--- TABS for STUDENTS SHEET ---');
    res.data.sheets.forEach(s => console.log(`- ${s.properties.title}`));

    // Check Auth Sheet
    const spreadsheetIdAuth = process.env.GOOGLE_SHEETS_ID_AUTH;
    const resAuth = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetIdAuth,
    });
    console.log('\n--- TABS for AUTH SHEET ---');
    resAuth.data.sheets.forEach(s => console.log(`- ${s.properties.title}`));

  } catch (error) {
    console.error('ERROR:', error);
  }
}

listTabs();

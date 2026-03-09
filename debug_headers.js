const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function debugHeaders() {
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
    range: `'${targetSheet}'!A1:ZZ5`,
  });

  const rows = response.data.values || [];
  const headers = rows[0].map(h => String(h || '').trim());
  console.log('Headers count:', headers.length);
  console.log('Headers:', JSON.stringify(headers));
  
  if (rows.length > 1) {
    const firstRow = rows[1];
    console.log('First student row count:', firstRow.length);
    const student = {};
    headers.forEach((h, i) => {
        student[h] = firstRow[i];
    });
    console.log('First student object:', JSON.stringify(student, null, 2));
    console.log('cr69d_student_id value:', student['cr69d_student_id']);
  }
}

debugHeaders();

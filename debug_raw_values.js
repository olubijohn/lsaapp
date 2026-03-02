const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function debugValues() {
  try {
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
      range: `'${targetSheet}'!A1:ZZ100`,
    });

    const rows = response.data.values;
    const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
    const instuCol = headers.indexOf('cr69d_instucode');

    console.log('--- RAW VALUES DEBUG ---');
    console.log('Header at index', instuCol, ':', rows[0][instuCol]);

    rows.slice(1, 11).forEach((row, i) => {
        const val = row[instuCol];
        console.log(`Row ${i+1}: raw="${val}" | type=${typeof val} | trimmed="${String(val || '').trim()}"`);
    });

    const matches = rows.slice(1).filter(row => {
        const studentOrg = String(row[instuCol] || '').trim();
        return studentOrg === "5";
    });
    console.log('\nTotal matches for string "5":', matches.length);

  } catch (error) {
    console.error('DEBUG ERROR:', error);
  }
}

debugValues();

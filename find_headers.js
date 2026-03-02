const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function findHeaders() {
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
      range: `'${targetSheet}'!A1:ZZ20`,
    });

    const rows = response.data.values;
    console.log('--- SEARCHING FOR HEADERS ---');
    rows.forEach((row, rowIndex) => {
        const headers = row.map(h => String(h || '').trim().toLowerCase());
        const instuCol = headers.indexOf('cr69d_instucode');
        if (instuCol !== -1) {
            console.log(`FOUND cr69d_instucode at Row ${rowIndex}, Col ${instuCol}`);
            console.log(`Row contents: ${row.slice(0, 10).join(', ')}...`);
        }
    });
    console.log('-----------------------------');

  } catch (error) {
    console.error('ERROR:', error);
  }
}

findHeaders();

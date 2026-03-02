const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function sampleData() {
  try {
    console.log('Env Check:', {
        email: process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 10) + '...',
        hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
        id: process.env.GOOGLE_SHEETS_ID
    });

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_AUTH;
    const targetSheet = 'cr69d_usertokens.csv';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:ZZ100`,
    });

    const rows = response.data.values;
    const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
    const usernameIndex = headers.indexOf('cr69d_username');
    const instuIndex = headers.indexOf('cr69d_instucode');
    const orgIndex = headers.indexOf('cr69d_organisation');
    
    console.log('--- USER t SEARCH ---');
    const userT = rows.slice(1).find(row => String(row[usernameIndex] || '').trim().toLowerCase() === 't');
    
    if (userT) {
        console.log(`Username: ${userT[usernameIndex]}`);
        console.log(`InstuCode: "${userT[instuIndex]}" (type: ${typeof userT[instuIndex]})`);
        console.log(`Organisation: "${userT[orgIndex]}"`);
    } else {
        console.log('User "t" not found.');
    }
    console.log('----------------------');

    const instuCol = headers.indexOf('cr69d_instucode');
    const levelCol = headers.indexOf('cr69d_level');
    const genderCol = headers.indexOf('cr69d_gender');
    
    console.log('Indexes:', { instuCol, levelCol, genderCol });

    rows.slice(0, 10).forEach((row, i) => {
        console.log(`Row ${i} InstuCode: "${row[instuCol]}" | Level: "${row[levelCol]}" | Gender: "${row[genderCol]}" | Title: "${row[headers.indexOf('cr69d_title')]}"`);
    });

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  }
}

sampleData();

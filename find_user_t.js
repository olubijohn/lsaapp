const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function findUserT() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID_AUTH;
    const targetSheet = 'cr69d_usertokens.csv';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:ZZ500`,
    });

    const rows = response.data.values;
    const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
    const usernameIndex = headers.indexOf('cr69d_username');
    const instuIndex = headers.indexOf('cr69d_instucode');
    const orgIndex = headers.indexOf('cr69d_organisation');

    const userT = rows.slice(1).find(row => String(row[usernameIndex] || '').trim().toLowerCase() === 't');

    if (userT) {
        console.log('--- USER T DETAILS ---');
        console.log(`Username: ${userT[usernameIndex]}`);
        console.log(`InstuCode Value: "${userT[instuIndex]}"`);
        console.log(`Organisation Value: "${userT[orgIndex]}"`);
        console.log('-----------------------');
    } else {
        console.log('User "t" NOT FOUND in Auth Sheet');
    }

  } catch (error) {
    console.error('ERROR:', error);
  }
}

findUserT();

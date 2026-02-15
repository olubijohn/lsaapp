const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkStudentHeaders() {
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
      range: `'${targetSheet}'!1:1`,
    });

    const headers = response.data.values?.[0] || [];

    const sampleResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${targetSheet}'!2:4`,
    });

    const result = {
        spreadsheetId,
        targetSheet,
        headers,
        sampleData: sampleResponse.data.values
    };
    
    fs.writeFileSync('student_data_diagnostic.json', JSON.stringify(result, null, 2));
    console.log('Diagnostic results saved to student_data_diagnostic.json');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStudentHeaders();

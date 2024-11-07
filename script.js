// Google Sheets API settings - AIzaSyDBNQLwWOGsFE5Dlu2cTw-dojeUMQYsel4
const API_KEY = 'AIzaSyDBNQLwWOGsFE5Dlu2cTw-dojeUMQYsel4';  // Replace with your Google API key
const SHEET_ID = '1mOToU4dHHLwUx1i9BbahH497EwGU4HRDG7za8hT2j2A';  // Your Google Sheet ID
const RANGE = 'Sheet1!A:J';  // The range covering all the columns (A to J)

// Object to store notes by call row
let notesData = {};

// Function to fetch data from Google Sheets
async function fetchGoogleSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.values;  // Return the rows of data
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Function to display the data in the table
function displayData(rows) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';  // Clear any previous content

  // Skip the first row if it's the header
  rows.slice(1).forEach((row, index) => {
    const tr = document.createElement('tr');
    

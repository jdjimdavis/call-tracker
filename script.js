// Google Sheets API settings
const API_KEY = 'AIzaSyDBNQLwWOGsFE5Dlu2cTw-dojeUMQYsel4';  // Replace with your Google API key
const SHEET_ID = '1mOToU4dHHLwUx1i9BbahH497EwGU4HRDG7za8hT2j2A';  // Your Google Sheet ID
const RANGE = 'Sheet1!A:J';  // The range covering all the columns (A to J)

// Function to fetch data from Google Sheets
async function fetchGoogleSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayData(data.values);  // Call a function to display the data in the table
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display the data in the table
function displayData(rows) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';  // Clear any previous content
  
  // Iterate over each row of data (skip the first row if it's headers)
  rows.slice(1).forEach(row => {
    const tr = document.createElement('tr');
    
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    
    tableBody.appendChild(tr);
  });
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);

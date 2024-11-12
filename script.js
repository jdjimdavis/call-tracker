// Google Sheets API settings - AIzaSyDBNQLwWOGsFE5Dlu2cTw-dojeUMQYsel4
const API_KEY = 'AIzaSyDBNQLwWOGsFE5Dlu2cTw-dojeUMQYsel4';  // Replace with your Google API key
const SHEET_ID = '1mOToU4dHHLwUx1i9BbahH497EwGU4HRDG7za8hT2j2A';  // Your Google Sheet ID
const RANGE = 'Sheet1!A:J';  // The range covering all the columns (A to J)

console.log('Script is running');

// Function to fetch data from Google Sheets (rest of your code)

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

// Function to display the data in the table and make certain fields editable
function displayData(rows) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';  // Clear any previous content

  // Skip the first row if it's the header
  rows.slice(1).forEach((row, index) => {
    const tr = document.createElement('tr');
    
    // Date, Time, Caller Info, Message, Client Phone (non-editable)
    for (let i = 0; i < 5; i++) {
      const td = document.createElement('td');
      td.textContent = row[i];  // Display the data
      tr.appendChild(td);
    }

    // Editable fields: Intake Person, Returned Call?, Assigned Case?, Assigned To
    for (let i = 5; i < 9; i++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = row[i] || '';  // Pre-fill with existing data or leave empty
      input.dataset.rowIndex = index;  // Store row index for saving later
      input.dataset.colIndex = i;  // Store column index for saving later
      td.appendChild(input);
      tr.appendChild(td);
    }

    // Add a "Save" button to save the row changes
    const saveTd = document.createElement('td');
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.dataset.rowIndex = index;  // Store row index for saving
    saveButton.addEventListener('click', saveRowData);  // Add event listener for saving
    saveTd.appendChild(saveButton);
    tr.appendChild(saveTd);

    tableBody.appendChild(tr);
  });
}

// Function to save changes to the row in Google Sheets
async function saveRowData(event) {
  const rowIndex = event.target.dataset.rowIndex;  // Get the row index from the button's data attribute

  // Get the row inputs for this row
  const rowInputs = document.querySelectorAll(`input[data-row-index="${rowIndex}"]`);
  const updatedData = Array.from(rowInputs).map(input => input.value);  // Collect input values

  console.log('Saving data for row:', rowIndex, updatedData);

  // Send the updated data back to Google Sheets
  await updateGoogleSheet(rowIndex, updatedData);
}

// Function to update a specific row in Google Sheets
async function updateGoogleSheet(rowIndex, updatedData) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A${parseInt(rowIndex) + 2}:J${parseInt(rowIndex) + 2}?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  const body = {
    range: `Sheet1!A${parseInt(rowIndex) + 2}:J${parseInt(rowIndex) + 2}`,
    majorDimension: 'ROWS',
    values: [updatedData]
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      console.log('Row successfully updated in Google Sheets!');
      alert('Row successfully updated!');
    } else {
      console.error('Failed to update the row:', await response.text());
      alert('Failed to update the row.');
    }
  } catch (error) {
    console.error('Error updating row:', error);
  }
}

// Helper function to parse dates in the mm/dd/yyyy format
function parseDate(dateString) {
  if (!dateString || !dateString.includes('/')) {
    console.log(`Invalid date string: ${dateString}`);  // Log the invalid date
    return null;  // Return null if the date is invalid
  }

  // Split the date string into [month, day, year]
  const [month, day, year] = dateString.split('/');
  
  // Create a new Date object in the format (year, month - 1, day)
  const parsedDate = new Date(year, month - 1, day);

  if (isNaN(parsedDate)) {
    console.log(`Parsed Invalid Date: ${dateString}`);  // Log if parsing fails
    return null;
  }

  console.log(`Parsed Date: ${parsedDate} from input ${dateString}`);  // Log the parsed date
  return parsedDate;
}

// Filter function to apply date filtering
function applyDateFilter(rows) {
  const filterDate = document.querySelector('#filterDate').value;  // Get the input date
  if (!filterDate) {
    displayData(rows);  // If no filter is applied, show all data
    return;
  }

  const selectedDate = new Date(filterDate);  // Parse the selected date from the input (YYYY-MM-DD)
  console.log(`Selected Date for Filtering: ${selectedDate}`);  // Log the selected date for debugging

  // Filter the rows based on the selected date
  const filteredRows = rows.filter(row => {
    const callDate = parseDate(row[0]);  // Assuming the date is in the first column (index 0)

    if (!callDate) {
      // Skip rows with invalid or empty dates
      console.log(`Skipping invalid call date for row: ${row}`);
      return false;
    }

    console.log(`Comparing Call Date: ${callDate} with Selected Date: ${selectedDate}`);  // Log comparison
    return callDate >= selectedDate;  // Only show rows after or on the selected date
  });
  
  displayData(filteredRows);  // Display filtered data
}

// Event listener for the filter button
document.querySelector('#filterButton').addEventListener('click', async () => {
  const rows = await fetchGoogleSheetData();  // Fetch the data first
  applyDateFilter(rows);  // Apply the filter and display data
});

// Initial call to fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const rows = await fetchGoogleSheetData();
  displayData(rows);  // Display the data without filtering initially
});

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
    
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    
    // Add a textarea in the "Notes" column
    const notesTd = document.createElement('td');
    const notesTextarea = document.createElement('textarea');
    notesTextarea.placeholder = "Add notes here...";
    notesTextarea.value = notesData[index] || '';  // Pre-fill if there's existing data
    notesTextarea.addEventListener('input', (event) => {
      notesData[index] = event.target.value;  // Store the input value
    });
    notesTd.appendChild(notesTextarea);
    tr.appendChild(notesTd);

    tableBody.appendChild(tr);
  });
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

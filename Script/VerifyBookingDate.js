function IterateAndVerifyBookingDates() {
  const sectionDfp =Aliases.chrome.pageMagayaDigitalFreightPortalHu6.sectionDfp;
 
  if (!sectionDfp.Exists) {
    Log.Error("The 'sectionDfp' section was not found. Ensure the page is loaded correctly.");
    return;
  }
 
  Log.Message("The 'sectionDfp' section was found. Attempting to locate the booking table.");
 
  let tableBody;
  try {
    tableBody = sectionDfp.FindElement("//tbody[@role='rowgroup' and contains(@class, 'p-datatable-tbody')]");
  } catch (e) {
    Log.Error("Error locating table body. It might be missing or the selector is incorrect: " + e.message);
    return;
  }
 
  if (!tableBody.Exists) {
    Log.Error("Table body not found within 'sectionDfp'. The table structure might have changed.");
    return;
  }
 
  let rows = tableBody.FindElements("//tr[contains(@class, 'ng-star-inserted')]");
  if (rows.length === 0) {
    Log.Error("No rows found in the table. The table is either empty or the row selector is incorrect.");
    return;
  }
 
  Log.Message(`Found ${rows.length} rows in the booking table.`);
 
  const bookingDateColumnIndex = 7;
  const parsedDates = []; // Now stores actual Date objects
 
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let cells = row.FindElements("./td");
 
    if (cells.length <= bookingDateColumnIndex) {
      Log.Message(`Row ${i + 1} does not have enough columns to access the booking date. Skipping this row.`);
      continue;
    }
 
    let dateText = cells[bookingDateColumnIndex].contentText.trim();
    Log.Message(`Row ${i + 1} - Raw Booking Date Text: '${dateText}'`);
 
    let actualDate = convertRelativeDateToActualDate(dateText); // Call the new function
    if (actualDate !== null) {
      parsedDates.push({ row: i + 1, text: dateText, actualDate: actualDate });
    } else {
      Log.Message(`Could not parse date for row ${i + 1}: '${dateText}'. This row will not be included in the sorting verification.`);
    }
  }
 
  if (parsedDates.length < 2) {
    Log.Warning("Not enough valid dates parsed to perform a sorting verification. At least two rows with parsable dates are needed.");
    return;
  }
 
  Log.Message("Verifying booking dates are in **descending chronological order (oldest first)**...");
 
  // Verify descending chronological order (oldest dates first)
  for (let i = 0; i < parsedDates.length - 1; i++) {
    const current = parsedDates[i];
    const next = parsedDates[i + 1];
 
    // For oldest first: current.actualDate should be less than or equal to next.actualDate
    // (e.g., '1 month ago' (May 20, 2025 - 1 month = April 20, 2025) should be <= '25 days ago' (May 20, 2025 - 25 days = April 25, 2025))
    if (current.actualDate.getTime() <= next.actualDate.getTime()) {
      Log.Checkpoint(`Row ${current.row} ('${current.text}' - ${current.actualDate.toLocaleString()}) is correctly ordered before or at Row ${next.row} ('${next.text}' - ${next.actualDate.toLocaleString()}).`);
    } else {
      Log.Error(`Sorting error: Row ${current.row} ('${current.text}' - ${current.actualDate.toLocaleString()}) is **newer** than Row ${next.row} ('${next.text}' - ${next.actualDate.toLocaleString()}), violating **descending chronological order (oldest first)**.`);
    }
  }
  Log.Message("Booking date verification complete.");
}
 
/**
* Converts relative date strings to an actual Date object.
* @param {string} text The relative date string (e.g., "3 years ago", "2 months ago", "1 day ago", "2 hours ago", "just now").
* @returns {Date|null} A Date object representing the approximate past date, or null if parsing fails.
*/
function convertRelativeDateToActualDate(text) {
  const lowerText = text.toLowerCase();
  // Using a consistent reference point (e.g., current date at script execution)
  const now = new Date();
 
  if (lowerText.includes("just now") || lowerText.includes("seconds ago")) {
    return now; // Return current time for "just now" / "seconds ago"
  }
 
  // Regex to capture number and unit (singular or plural), allowing for implicit '1' (e.g., "a month ago")
  const regex = /(\d*)\s*(minute|hour|day|week|month|year)s?\s+ago/i;
  const match = lowerText.match(regex);
 
  if (!match) {
    return null; // No match found for standard relative formats
  }
 
  let number = parseInt(match[1]);
  const unit = match[2];
 
  // Handle cases like "a month ago" where the number might be implicit
  if (isNaN(number) && ['month', 'year', 'week', 'day', 'hour', 'minute'].includes(unit) && lowerText.startsWith('a ')) {
      number = 1;
  } else if (isNaN(number)) {
      return null; // Could not parse the number from the string
  }
 
  const pastDate = new Date(now); // Start with current date and adjust
 
  switch (unit) {
    case "minute":
      pastDate.setMinutes(pastDate.getMinutes() - number);
      break;
    case "hour":
      pastDate.setHours(pastDate.getHours() - number);
      break;
    case "day":
      pastDate.setDate(pastDate.getDate() - number);
      break;
    case "week":
      pastDate.setDate(pastDate.getDate() - (number * 7));
      break;
    case "month":
      // setMonth handles month rollovers correctly (e.g., subtracting 1 month from March 31 results in Feb 29/28)
      pastDate.setMonth(pastDate.getMonth() - number);
      break;
    case "year":
      pastDate.setFullYear(pastDate.getFullYear() - number);
      break;
    default:
      return null;
  }
  return pastDate;
}
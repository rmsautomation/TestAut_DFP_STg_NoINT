function IterateAndVerifyBookingDates() {
  const sectionDfp = Aliases.chrome.pageMagayaDigitalFreightPortalHu6.sectionDfp;

  if (!sectionDfp.Exists) {
    Log.Error("The 'sectionDfp' section was not found.");
    return;
  }

  Log.Message("The 'sectionDfp' section was found.");

  let tableBody;
  try {
    tableBody = sectionDfp.FindElement("//tbody[@role='rowgroup' and contains(@class, 'p-datatable-tbody')]");
  } catch (e) {
    Log.Error("Error locating table body: " + e.message);
    return;
  }

  if (!tableBody.Exists) {
    Log.Error("Table body not found.");
    return;
  }

  let rows = tableBody.FindElements("//tr[contains(@class, 'ng-star-inserted')]");
  if (rows.length === 0) {
    Log.Error("No rows found in the table.");
    return;
  }

  Log.Message("Found " + rows.length + " rows.");

  const bookingDateColumnIndex = 7;
  const parsedDates = [];

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let cells = row.FindElements("./td");

    if (cells.length <= bookingDateColumnIndex) {
      Log.Warning(`Row ${i + 1} doesn't have enough columns.`);
      continue;
    }

    let text = cells[bookingDateColumnIndex].contentText.trim();
    Log.Message(`Row ${i + 1} - Booking Date: '${text}'`);

    let daysAgo = convertRelativeDateToDays(text);
    if (daysAgo !== null) {
      parsedDates.push({ row: i + 1, text: text, daysAgo: daysAgo });
    } else {
      Log.Warning(`Could not parse date for row ${i + 1}: '${text}'`);
    }
  }

  // Verify descending order (greater or equal)
  for (let i = 0; i < parsedDates.length - 1; i++) {
    const current = parsedDates[i];
    const next = parsedDates[i + 1];

    if (current.daysAgo >= next.daysAgo) {
      Log.Checkpoint(`Row ${current.row} ('${current.text}') >= Row ${next.row} ('${next.text}')`);
    } else {
      Log.Error(`Sorting error: Row ${current.row} ('${current.text}') is earlier than Row ${next.row} ('${next.text}')`);
    }
  }
}

// Converts strings like "3 years ago", "2 months ago", "1 day ago" to approximate number of days
function convertRelativeDateToDays(text) {
  if (text.toLowerCase().includes("just now") || text.toLowerCase().includes("seconds ago")) return 0;

  const regex = /(\d+)\s+(year|month|week|day)s?\s+ago/i;
  const match = text.match(regex);

  if (!match) return null;

  const number = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "year": return number * 365;
    case "month": return number * 30;
    case "week": return number * 7;
    case "day": return number;
    default: return null;
  }
}

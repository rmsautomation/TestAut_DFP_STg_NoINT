function openLastDownloadedFile() {
  // Delay to ensure file download is complete
  Delay(10000);
 
  var fso = Sys.OleObject("Scripting.FileSystemObject");
 
  // Get the user's profile path and construct the Downloads folder path
  var userProfilePath = aqEnvironment.GetEnvironmentVariable("USERPROFILE");
  var downloadFolder = userProfilePath + "\\Downloads";
 
  // Check if the Downloads folder exists
  if (!fso.FolderExists(downloadFolder)) {
    Log.Error("Downloads folder not found: " + downloadFolder);
    return;
  }
 
  // Get all files in the Downloads folder
  var folder = fso.GetFolder(downloadFolder);
  var files = new Enumerator(folder.Files);
 
  var latestFile = null;
  var latestDate = new Date(0);  // Initialize with the minimum date
 
  // Loop through the files to find the most recent one
  for (; !files.atEnd(); files.moveNext()) {
    var file = files.item();
    if (file.DateLastModified > latestDate) {
      latestDate = file.DateLastModified;
      latestFile = file;
    }
  }
 
  // If a recent file is found, proceed
  if (latestFile) {
    Log.Message("The most recent file is: " + latestFile.Name);
 
    // Construct full path to the file
    var filePath = downloadFolder + "\\" + latestFile.Name;
 
    // Check if the latest file is a CSV
    if (fso.GetExtensionName(filePath).toLowerCase() == "csv") {
 
      // Open the CSV file using TextStream
      var csvFile = fso.OpenTextFile(filePath, 1); // 1 = ForReading
 
      var rowCount = 0;
 
      // Read each line and count rows
      while (!csvFile.AtEndOfStream) {
        var line = csvFile.ReadLine();
        rowCount++;
      }
 
      csvFile.Close();  // Close the file after reading
 
      // Log the row count and check if it matches Project.Variables.number_quotes
      Log.Message("Number of rows in CSV: " + rowCount);
      if ((rowCount - 1) == Project.Variables.quote_number) {
        Log.Message("The number of rows matches the expected value. Test PASSED");
      } else {
        Log.Error("The number of rows does not match the expected value. Test FAILED");
      }
 
    } else {
      Log.Error("The latest file is not a CSV.");
    }
  } else {
    Log.Error("No files found in the Downloads folder.");
  }
}
function checkElementCount() {
    // Get the text content from the specified section of the webpage
    var elementText = Aliases.browser.pageMagayaDigitalFreightPortalHu2.sectionQwyk.panel125Of29770.textContent;

    // Use a regular expression to extract the total count from the text
    var matches = elementText.match(/of\s(\d+)/);
    // Parse the extracted count as an integer, or set to 0 if no match is found
    var totalCount = matches ? parseInt(matches[1]) : 0;

    // Define an array of elements with their corresponding names and XPath expressions
    var elements = [
        { name: "panelAylinTestCount", xpath: "//div[contains(text(), 'TestingProd')]" },
        { name: "cellCount", xpath: "//td[div[contains(text(), 'Ocean')] and div/span[contains(text(), 'FCL')]]" },
        { name: "textnodeBooked2Count", xpath: "//span[@class='overflow-wrap ng-star-inserted']//div//span[contains(text(), 'Booked') or contains(text(), 'Arrived')]" }
    ];

    // Iterate over each element in the array
    for (var i = 0; i < elements.length; i++) {
        // Evaluate the XPath and get the count of matching elements
        var result = Aliases.browser.pageMagayaDigitalFreightPortalHu2.EvaluateXPath(elements[i].xpath);

        if (result !== null && result.length > 0) {
        var count = result.length;
        // Log the count for the current element
        Log.Message("Count for " + elements[i].name + ": " + count);

        // Check if totalCount is greater than or equal to 25
        if (totalCount >= 25) {
            // Ensure the element count is exactly 25
            if (count === 25) {
                Log.Message(elements[i].name + " count is 25, and the test passes.");
            } else {
                Log.Error(elements[i].name + " count is NOT 25, test fails.");
            }
        } else {
            // If totalCount is less than 25, proceed with the usual comparison
            if (count === totalCount) {
                Log.Message(elements[i].name + " count matches totalCount.");
            } else {
                Log.Error(elements[i].name + " count does NOT match totalCount.");
            }
        }
    }
    else{
      Log.Message("There are not Quote for this filter");
    }
    }

    // Log the extracted total number for reference
    Log.Message("Extracted total number: " + totalCount);
}

function checkFilter(xpath, elementType) {
  // Find elements based on the provided XPath
  var elements = Aliases.browser.pageQuotationMagayaDigitalFreigh.FindElements(xpath);
  var elementCount = elements ? elements.length : null;

  // Extract the text from the 'p-datatable-footer' class
  var footerText = Aliases.browser.pageQuotationMagayaDigitalFreigh.FindElement("//div[contains(@class, 'p-datatable-footer')]").textContent;

  // Extract the second number from the text, which follows the pattern '1 - X of Y'
  var secondNumber = parseInt(footerText.match(/- (\d+) of/)[1]);

  // If elementCount is null
  if (elementCount === null) {
    if (secondNumber === 0) {
      Log.Message("No '" + elementType + "' elements found, and the second number is 0. The test passes.");
    } else {
      Log.Error("No '" + elementType + "' elements found, but the second number is different from 0. The test fails.");
    }
    return; // Exit the function as there's no need to continue
  }

  // Condition 1: Compare the number of elements with the second number
  if (elementCount === secondNumber) {
    Log.Message("The number of '" + elementType + "' elements matches the second number: " + secondNumber);
  } else {
    Log.Error("The number of '" + elementType + "' elements does not match. Expected: " + secondNumber + ", found: " + elementCount);
  }

  // Condition 2: If the second number is 25 or more, the number of elements must be exactly 25
  if (secondNumber >= 25 && elementCount !== 25) {
    Log.Error("Expected number of '" + elementType + "' elements is 25, but found: " + elementCount);
  }
}

function checkCompletedStatus() {
  var completedXPath = "//span[@class='overflow-wrap ng-star-inserted']//div//span[contains(text(), 'Completed')]";
  checkFilter(completedXPath, "Completed");
}

function checkShipmentReference() {
  var shipmentXPath = "//a[contains(@href, '/shipments/') and normalize-space(text())='Shipment7636-6']";
  checkFilter(shipmentXPath, "Shipment Reference Shipment7636-6");
}

function checkCustomer() {
  var shipmentXPath = "//div[normalize-space(text())='Customer 4471 - Update']";
  checkFilter(shipmentXPath, "Customer 4471 - Update");
}

function checkCustomerReference() {
  var shipmentXPath = "//div[@class='small' and contains(normalize-space(text()), 'Shipment7636-6')]";
  checkFilter(shipmentXPath, "Customer Reference Shipment7636-6");
}

function checkMilestoneConfirmed() {
  var completedXPath = "//span[@class='overflow-wrap ng-star-inserted']//div//span[contains(text(), 'Confirmed')]";
  checkFilter(completedXPath, "Status Confirmed");
}

function checkMasterBL() {
  var completedXPath = "//div[normalize-space(text())='HLCUSEL240158109']";
  checkFilter(completedXPath, "MasterBL HLCUSEL240158109");
}

function checkHouseBL() {
  var completedXPath = "//div[normalize-space(text())='8109']";
  checkFilter(completedXPath, "HouseBL 8109");
}

function checkETD() {
  var completedXPath = "//span[contains(normalize-space(text()), '12/18/2024')]";
  checkFilter(completedXPath, "ETD 12/18/2024");
}
function checkETA() {
  var completedXPath = "//span[contains(normalize-space(text()), '01/30/2025')]";
  checkFilter(completedXPath, "ETA 01/30/2025");
}

function checkAIRProduct() {
  var completedXPath = "//div[normalize-space(text())='Air']";
  checkFilter(completedXPath, "AIR");
}

function checkVessel() {
  var completedXPath = "//td[contains(normalize-space(text()), '123')]";
  checkFilter(completedXPath, "Vessel 123");
}

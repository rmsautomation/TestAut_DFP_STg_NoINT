function verifyPriceSum(charge_value) {
  var priceString= Project.Variables.original_price;
    // Step 1: Clean the price string by removing the dollar sign and commas
    var numericString = priceString.replace(/[$,]/g, "");
 
    // Step 2: Convert the cleaned string to a number
    var priceNumber = parseFloat(numericString);
    var charge_valueNum = parseFloat(charge_value);
 
    if (isNaN(priceNumber)) {
        Log.Error("The price string could not be converted to a valid number.");
        return;
    }
 
    // Step 3: Add the additional amount to the price
    var expected_price = priceNumber + charge_valueNum;
 
    // Step 4: Compare the result with the expected final price
    var final_price_string = Project.Variables.final_price; // Assume final_price is a number variable
    
     var numericFinalString = final_price_string.replace(/[$,]/g, "");
 
    // Step 2: Convert the cleaned string to a number
    var final_priceNumber = parseFloat(numericFinalString);
 
    if (isNaN(final_priceNumber)) {
        Log.Error("The price string could not be converted to a valid number.");
        return;
    }
 
    if (expected_price === final_priceNumber) {
        Log.Message("The sum is correct: " + expected_price);
    } else {
        Log.Error("The sum is incorrect. Expected: " + final_priceNumber + ", but got: " + expected_price);
    }
}

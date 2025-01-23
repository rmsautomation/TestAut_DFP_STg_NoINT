function cleanCacheAndCookies() {
 
  var browser = Browsers.Item(btChrome);
  if (browser.Exists) {
    Aliases.browser.BrowserWindow.Close();
    Log.Message("Closed any existing Chrome instances.");
  }
 
  var options = "--disable-cache --clear-token-service --disable-application-cache";
 
  browser.RunOptions = options;
  browser.Run();
  Log.Message("Chrome launched with cache and cookies cleared.");
 
  browser.Navigate("about:blank");
  Log.Message("Navigated to 'about:blank' to complete the cache and cookies cleaning.");
 
  Aliases.browser.BrowserWindow.Close();
  Log.Message("Browser closed after cleaning cache and cookies.");
}
 

function Hooks_OnStartTestCase(Sender, StartTestCaseParams)
{
  var browser = Browsers.Item(btChrome);
  if (browser.Exists) {
    Aliases.browser.BrowserWindow.Close();
    Log.Message("Closed any existing Chrome instances.");
  }
 
  var options = "--disable-cache --clear-token-service --disable-application-cache";
 
  browser.RunOptions = options;
  browser.Run();
  Log.Message("Chrome launched with cache and cookies cleared.");
 
  browser.Navigate("about:blank");
  Log.Message("Navigated to 'about:blank' to complete the cache and cookies cleaning.");
 
  Aliases.browser.BrowserWindow.Close();
  Log.Message("Browser closed after cleaning cache and cookies.");
  
}
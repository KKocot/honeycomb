import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the page
    await page.goto('http://localhost:3031', { waitUntil: 'networkidle' });
    console.log('Page loaded');
    
    // Wait 5 seconds for the page to fully load
    await page.waitForTimeout(5000);
    console.log('Waited 5 seconds');
    
    // Find and click the pill badge button with class "rounded-full"
    const pillButton = await page.$('button.rounded-full');
    if (pillButton) {
      await pillButton.click();
      console.log('Clicked pill button');
    } else {
      console.log('Pill button not found');
    }
    
    // Wait 2 seconds for the popover to appear
    await page.waitForTimeout(2000);
    console.log('Waited 2 seconds for popover');
    
    // Take a screenshot
    const screenshotPath = '/tmp/honeycomb_popover.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();

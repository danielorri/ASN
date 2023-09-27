const fillForm = require("./helpers/fillForm");

const startASN = async (page, initialPart, shipping) => {
  await page.waitForSelector('#search-btn-id');
  // Click the search button
  await page.click('#search-btn-id');

  // Assuming you have already navigated to the target page in your Puppeteer script
  const maxRetries = 3;
  let retries = 0;
  let isClicked = false;

  while (retries < maxRetries && !isClicked) {
    try {
      await page.waitForSelector('li.w-tabitem a#_5b8awc'); // Wait for the element to appear with a 5-second timeout
      await page.click('li.w-tabitem a#_5b8awc'); // Click the element
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for navigation

      // Element clicked and navigation completed successfully
      isClicked = true;
    } catch (error) {
      console.error(`Attempt ${retries + 1}: Element not found or could not be clicked. Error: ${error.message}`);
      retries++;

      // You can add a page reload here if needed
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
  }

  await page.waitForSelector('input#_djckb'); // Wait for the input field to appear
  await page.type('input#_djckb', initialPart.partNo);

  await page.waitForSelector('button#_ekoifc'); // Wait for the button to become visible
  await page.click('button#_ekoifc'); // Click the button

  async function processRows() {
    const rows = await page.$$('tr.tableRow1');
    for (const row of rows) {
      const partNumberElement = await row.$('td:nth-child(7) a');
      const partNumber = await partNumberElement.evaluate((element) => element.textContent.trim());
      const plantCode = await row.$('td:nth-child(15)');
      if (plantCode) {
        // Use evaluate to get the text content of the plantCode element
        const plantCodeText = await plantCode.evaluate((element) => element.textContent.trim());
        // Compare the plantCodeText with shipping.PlantCode
        if (plantCodeText.includes(shipping.PlantCode)) {
          // The plantCode matches shipping.PlantCode
          // Add your logic here
          if (shipping.ShipTo === "10") {
            // Find a clickable element within the row and click it
            if (partNumber.startsWith('V')) {
              const clickableElement = await row.$('td'); // You can adjust the selector to find the clickable element
              if (clickableElement) {
                await clickableElement.click();
                console.log('Clicked the row');
                return true;
              }
            }
          } else {
            const clickableElement = await row.$('td'); // You can adjust the selector to find the clickable element
            if (clickableElement) {
              await clickableElement.click();
              console.log('Clicked the row');
              return true;
            }
          }
        } else {
          console.log("Plant code element not found.");
        }
      } else {
         console.log("Plant code element not found.");
      }
    }
  }

  let retries2 = 0;

  while (retries2 < 4) {
    try {
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for navigation
      await page.waitForSelector('tr.tableRow1');
      const res = await processRows();
        if(res === true){
            break; // Break out of the loop on successful row processing
        } else {
            throw new Error("Part not found");
        }// Break out of the loop on successful row processing
    } catch (error) {
      console.log(error);
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + retries2 + 1, 0);
      const endDate = new Date(today.getFullYear(), today.getMonth() + retries2 + 2, 0);
      await page.waitForTimeout(2000);
      await page.waitForSelector('input#DF_bovso');
      await page.click('input#DF_bovso', { clickCount: 3 });
      await page.$eval('input#DF_bovso', (input) => (input.value = '')); // Clear the input field
      await page.type('input#DF_bovso', formatDate(startDate));

      await page.waitForTimeout(2000);
      // Wait for the second input and change its value to the end date
      await page.waitForSelector('input#DF_jmnkgd');
      await page.click('input#DF_jmnkgd', { clickCount: 3 });
      await page.$eval('input#DF_jmnkgd', (input) => (input.value = '')); // Clear the input field
      await page.type('input#DF_jmnkgd', formatDate(endDate));
      await page.waitForTimeout(2000);

      await page.waitForSelector('button#_ekoifc'); // Wait for the button to become visible
      await page.click('button#_ekoifc'); // Click the button

      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
      }
      retries2++;
      console.log(`changing date ${retries2}`);
    }
  }

  await page.waitForSelector('button#_skczv');
  await page.click('button#_skczv');

  await fillForm(page, shipping);
};

module.exports = startASN;

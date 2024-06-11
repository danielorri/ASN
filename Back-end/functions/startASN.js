const fillForm = require("./helpers/fillForm");
const { getIo } = require("../socketManager"); 


const startASN = async (page, initialPart, shipping, pan1, pan2, socketId) => {
  const io = getIo();
        
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for navigation
  await page.waitForSelector('body > app-root > div > app-dashboard > div > div > app-home > div > div.search-container > app-search-bar > div > div.search-button-container > button');
  // Click the search button
  await page.click('body > app-root > div > app-dashboard > div > div > app-home > div > div.search-container > app-search-bar > div > div.search-button-container > button');

  // Assuming you have already navigated to the target page in your Puppeteer script
  const maxRetries = 3;
  let retries = 0;
  let isClicked = false;

  while (retries < maxRetries && !isClicked) {
    try {
      await page.waitForSelector('li.w-tabitem a#_5b8awc'); // Wait for the element to appear with a 5-second timeout
      await page.click('li.w-tabitem a#_5b8awc'); // Click the element
      await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Wait for navigation

      // Element clicked and navigation completed successfully
      isClicked = true;
    } catch (error) {
      io.to(socketId).emit('progressUpdate', { message: 'Reloading Page', progress: 6 });
      retries++;

      // You can add a page reload here if needed
      await page.reload({ waitUntil: 'networkidle2', timeout: 0 });
    }
  }

  
  await page.waitForSelector('input#_djckb'); // Wait for the input field to appear
  await page.type('input#_djckb', initialPart.partNo);

  await page.waitForSelector('button#_ekoifc'); // Wait for the button to become visible
  await page.click('button#_ekoifc'); // Click the button

  async function processRows() {
    const rows = await page.$$('tr.tableRow1');
    for (const row of rows) {
      const partNumberElement = await row.$(`td:nth-child(${pan1}) a`);
      const partNumber = await partNumberElement.evaluate((element) => element.textContent.trim());
      const plantCode = await row.$(`td:nth-child(${pan2})`);
      if (plantCode) {
        // Use evaluate to get the text content of the plantCode element
        const plantCodeText = await plantCode.evaluate((element) => element.textContent.trim());
        // Compare the plantCodeText with shipping.PlantCode
        if (plantCodeText.includes(shipping.PlantCode)) {
          // The plantCode matches shipping.PlantCode
          if (shipping.ShipTo != "10") {
            if (!partNumber.startsWith('V')) {
              const clickableElement = await row.$('td'); // You can adjust the selector to find the clickable element
              if (clickableElement) {
                await clickableElement.click();
                io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} selected`, progress: 7 });
                return true;
              }
          }
        }
          // Add your logic here
          if (shipping.ShipTo === "10") {
            // Find a clickable element within the row and click it
            if (partNumber.startsWith('V')) {
              const clickableElement = await row.$('td'); // You can adjust the selector to find the clickable element
              if (clickableElement) {
                await clickableElement.click();
                io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} selected`, progress: 7 });
                return true;
              }
            }
          } 
        } else {
          io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} not found`, progress: 7 });
        }
      } else {
        io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} not found`, progress: 7 });
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
          io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} not found`, progress: 7 });
        }
    } catch (error) {
      io.to(socketId).emit('progressUpdate', { message: `Part no.${initialPart.partNo} not found`, progress: 7 });
      const elements = await page.$$('span.w-togglebox-icon-off');
    
    if (elements.length > 0) {
      // Click on each element with the specified class
      for (const element of elements) {
        await element.click();
      }

    } else {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + retries2, 0);
      const endDate = new Date(today.getFullYear(), today.getMonth() + retries2 + 1, 0);
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
      io.to(socketId).emit('progressUpdate', { message: `Changing date ${startDate} - ${endDate}`, progress: 7 });
    }
    }
  }

  await page.waitForSelector('button#_skczv');
  await page.click('button#_skczv');

  await fillForm(page, shipping, socketId);
};

module.exports = startASN;

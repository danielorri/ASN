const enterQuantity = async (page, parts) => {
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // or 'networkidle2'

    let arri = 0;
    let nextPageButtonExists = true;
    console.log("quantities being enetered");
    while (nextPageButtonExists) {
      // Wait for the input element to appear on the page
      console.log("quantities being enetered 2");
      await page.waitForSelector('input.w-txt');
      const elements = await page.$$(`input.w-txt`);

      // Define a regular expression to match positive numbers with commas and dots
      const positiveNumberRegex = /^\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?$/;

      // Log the values of all the input elements
      for (const element of elements) {
        const value = await element.evaluate((el) => el.value.trim());
        console.log(value);
        // Check if the value is "2,000.000" and change it to "10,000"
        if (positiveNumberRegex.test(value)) {
          console.log('ok');
          await element.click({ clickCount: 3 }); // Triple-click to select all text
          await element.type('', { delay: 100 });
          await page.waitForTimeout(2000);
          await element.type(parts[arri].quantity, { delay: 100 });
          arri++;
        }
      }

      // Check if the "Next Page" button is available
      nextPageButtonExists = await page.evaluate(() => {
        const nextPageButton = document.querySelector('a#_ftw43d'); // Replace with the actual selector for the button
        return nextPageButton !== null;
      });

      // Click the "Next Page" button if it exists
      if (nextPageButtonExists) {
        await page.click('a#_ftw43d'); // Replace with the actual selector for the button
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      } else {
        break;
      }
    }

     // Wait for the button with the id _uz6b3 to appear
     await page.waitForSelector('button#_uz6b3');

     // Click the button
     await page.click('button#_uz6b3');
     

  } catch (error) {
    console.log(error);
  }
};

module.exports = enterQuantity;

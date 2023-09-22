const enterQuantity = async(page, parts) =>{
  try {
         await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
         // Wait for the input element to appear on the page
         await page.waitForSelector('input.w-txt');
         const elements = await page.$$(`input.w-txt`);
  
         // Define a regular expression to match positive numbers with commas and dots
        const positiveNumberRegex = /^\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?$/;
  
        let arri = 0;
        
        // Log the values of all the input elements
        for (const element of elements) {
          const value = await element.evaluate((el) => el.value.trim());
          console.log(value);
          // Check if the value is "2,000.000" and change it to "10,000"
          if (positiveNumberRegex.test(value)) {
            console.log("ok")
            await element.click({ clickCount: 3 }); // Triple-click to select all text
            await element.type('', {delay: 100});
            await page.waitForTimeout(2000);
            await element.type( parts[arri].quantity , {delay: 100});
            arri++;
          }
        }
  } catch (error) {
      console.log(error);
  }
  };
  
  module.exports = enterQuantity; 
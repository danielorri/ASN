const enterQuantity = async(page, parts) =>{
try {
       // Wait for the input element to appear on the page
       await page.waitForSelector('input.w-txt');
       const elements = await page.$$(`input.w-txt`);

      // Log the values of all the input elements
      for (const element of elements) {
        const value = await element.evaluate((el) => el.value.trim());
        console.log(value);
        // Check if the value is "2,000.000" and change it to "10,000"
        if (value === '2,000.000') {
          console.log("ok")
          await element.click({ clickCount: 3 }); // Triple-click to select all text
          await element.type('', {delay: 100});
          await page.waitForTimeout(100);
          await element.type('10,000', {delay: 2000});
        }
      }

} catch (error) {
    console.log("Not found");
}
};

module.exports = enterQuantity;
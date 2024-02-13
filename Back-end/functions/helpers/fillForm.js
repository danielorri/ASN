const fillForm = async(page, shipping) =>{
     // Assuming you have already navigated to the target page in your Puppeteer script
   const maxRetries = 3;
   let retries = 0;
   let isClicked = false;
 
   while (retries < maxRetries && !isClicked) {
     try {
       // Wait for the input fields to appear
        await page.waitForSelector('#_4t8sed');
        await page.waitForSelector('#DF_7ldr3');
        await page.waitForSelector('#DF_ptnsub');
       // Element clicked and navigation completed successfully
       isClicked= true;
     } catch (error) {
       console.error(`Attempt ${retries + 1}: Element not found or could not be clicked. Error: ${error.message}`);
       retries++;
 
       // You can add a page reload here if needed
       await page.reload({ waitUntil: 'domcontentloaded' });
     }
   }
    // Type the PackingSLipID into the first input field
    await page.type('#_4t8sed', shipping.PackingSLipID);

    // Type the shipping.ShippingDate into the second input field
    await page.type('#DF_7ldr3', shipping.ShippingDate);

    // Type the shipping.DeliveryDate into the third input field
    await page.type('#DF_ptnsub', shipping.DeliveryDate);

    await page.waitForSelector('div#__fxv4c');

    // Get the carrier dropdown element
    const carrierDropdown = await page.$('div#__fxv4c');

    // Click the carrier dropdown to open the options
    await carrierDropdown.click();

    // Wait for the carrier options to appear
    await page.waitForSelector('div.w-dropdown-items');

    // Convert shipping.CarrierName to lowercase for case-insensitive comparison
    const carrierNameLower = shipping.CarrierName.toLowerCase();

    // Find all carrier options
    const carrierOptions = await page.$$('div.w-dropdown-item');

    // Iterate through the options and click the one that contains the carrier name (case-insensitive)
    let optionClicked = false;
    for (const option of carrierOptions) {
        const optionText = await option.evaluate((el) => el.textContent.toLowerCase());
        if (optionText.includes(carrierNameLower)) {
        await option.click();
        optionClicked = true;
        console.log(`Selected carrier: ${shipping.CarrierName}`);
        break; // Exit the loop once a matching option is found and clicked
        }
    }

    if (!optionClicked) {
        console.error(`Carrier option containing '${shipping.CarrierName}' (case-insensitive) not found`);
    }
    await page.waitForSelector('input#_1f8mrd');
    // Type the shipping.TrackingNo into the input field
    await page.type('input#_1f8mrd', shipping.TrackingNo);

    
    // Wait for the button with the id _uz6b3 to appear
    await page.waitForSelector('button#_uz6b3');

    // Click the button
    await page.click('button#_uz6b3');
    


}

module.exports = fillForm;
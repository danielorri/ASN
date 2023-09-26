const repackItems = async(page, parts) =>{
   try {
    
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for navigation
     // Select all dropdown elements
     const dropdowns = await page.$$('label.ui-dropdown-label');

     // Loop through each dropdown and set the selected value based on parts[i].mixedOrMaster
     for (let i = 0; i < parts.length; i++) {
         const part = parts[i];
         const dropdown = dropdowns[i];

         // Click on the dropdown to open it
         await dropdown.click();

         // Find the option element based on the 'mixedOrMaster' field
         const optionText = part.mixedOrMaster === 'Mixed'
             ? 'MIXED PALLET MIX / BOX'
             : 'MASTER PALLET PLT / BOX';

         const optionSelector = `ul.ui-dropdown-items span:contains("${optionText}")`;

         // Wait for the option to appear and click it
         await page.waitForSelector(optionSelector);
         await page.click(optionSelector);

         // You can add additional logic here if needed, e.g., handling quantity and repackedQuantity fields

         // Wait for a moment to ensure the dropdown closes (you can adjust the delay as needed)
         await page.waitForTimeout(500);
     }

     await page.waitForSelector('input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid');
     const quantityFields = await page.$$('input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid');

     for(let i = 0; i < (parts.length * 2); i += 2){
        const firstQ = parts[i].quantity;
        const secondQ = parts[i + 1].repackedQuantity;
        const firstInput = quantityFields[i];
        const secondInput = quantityFields[i+1]

        // Clear the input field and type the appropriate value
        await firstInput.click({ clickCount: 3 }); // Select all text in the input field
        await firstInput.press('Backspace'); // Clear the input field
        await firstInput.type(firstQ);

        // Clear the input field and type the appropriate value
        await secondInput.click({ clickCount: 3 }); // Select all text in the input field
        await secondInput.press('Backspace'); // Clear the input field
        await secondInput.type(secondQ);
     }

     await page.waitForSelector("#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused");
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused');

   } catch (error) {
    console.log(error);
   }

}

module.exports = repackItems;
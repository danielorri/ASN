const repack = async(page, parts) =>{
    console.log("Repacking");
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0  });
    
    await page.waitForSelector('label.ui-dropdown-label', {timeout: 0});
     const dropdowns = await page.$$('label.ui-dropdown-label');

     // Loop through each dropdown and set the selected value based on parts[i].mixedOrMaster
     for (let i = 0; i < parts.length; i++) {
         const part = parts[i];
         const dropdown = dropdowns[i];

         // Click on the dropdown to open it
         await dropdown.click();

         await page.waitForSelector('ul.ui-dropdown-items li');
         const options = await page.$$('ul.ui-dropdown-items li'); // Select all options within the dropdown
        let optionClicked = false;

        for (const option of options) {
            const optionText = await option.evaluate((el) => el.textContent.toLowerCase());

            if (optionText.includes(part.mixedOrMaster.toLowerCase())) {
                await option.click();
                optionClicked = true;
                break; // Exit the loop after clicking the option
            }
        }

        if (!optionClicked) {
            console.log(`Option not found for ${part.mixedOrMaster}`);
        }

         // Wait for a moment to ensure the dropdown closes (you can adjust the delay as needed)
         await page.waitForTimeout(500);
     }

     await page.waitForSelector('input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid');
     const quantityFields = await page.$$('input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid');
     const filteredfields = [];
     for(const field of quantityFields ){
        const value = await field.evaluate((el) => el.value.trim());
        if(value === '10' || value === '5'){
            filteredfields.push(field);
        }
    }

        let e = 0;
        for(let i = 0; i < (parts.length * 2); i += 2){
            const firstQ = parts[e].quantity;
            const secondQ = parts[e].repackedQuantity;
            const firstInput = filteredfields[i];
            const secondInput = filteredfields[i+1]

            // Clear the input field and type the appropriate value
            await firstInput.click({ clickCount: 3 }); // Select all text in the input field
            await firstInput.press('Backspace'); // Clear the input field
            await firstInput.type(`${firstQ}`);

            // Clear the input field and type the appropriate value
            await secondInput.click({ clickCount: 3 }); // Select all text in the input field
            await secondInput.press('Backspace'); // Clear the input field
            await secondInput.type(`${secondQ}`);
            
            e++;
        }
}

module.exports = repack;
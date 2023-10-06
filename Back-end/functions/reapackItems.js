const handleCustomized = require("./helpers/handleCustomized");

const repackItems = async(page, parts) =>{
    const maxRetries = 3;
    let retries = 0;
    let isClicked = false;
  
    while (retries < maxRetries && !isClicked) {
   try {
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
            // Handle the case where the option was not found
        }

        // Rest of your code...


         // You can add additional logic here if needed, e.g., handling quantity and repackedQuantity fields

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
        await firstInput.type(firstQ);

        // Clear the input field and type the appropriate value
        await secondInput.click({ clickCount: 3 }); // Select all text in the input field
        await secondInput.press('Backspace'); // Clear the input field
        await secondInput.type(secondQ);
        
        e++;
     }

     await page.waitForSelector("button.nextButton.button-shape.button-focused");
     await page.click('button.nextButton.button-shape.button-focused');
     // handle customized
     console.log("Repacked successful");
    //  await handleCustomized(page, parts);
    await page.waitForTimeout(2000); 
     await page.waitForSelector("#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused");
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused');

     await page.waitForTimeout(2000); 
     await page.waitForSelector('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span',{timeout: 0});
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span');
     await page.waitForTimeout(5000); 
     console.log("Labels downloaded");
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.reviewButton.button-shape.button-focused');

    
     await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
     await page.waitForSelector('button#_t1zf');
     await page.click('button#_t1zf');
     await page.waitForTimeout(2000);
     await page.waitForSelector('button#_ogx3hc');
     await page.click('button#_ogx3hc');

     await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
     await page.waitForSelector('a#_lzc3hd');
     await page.click('a#_lzc3hd');
     console.log("ASN successful");
     isClicked = true;
    } catch (error) {
        console.error(`Attempt ${retries + 1}: Element not found or could not be clicked. Error: ${error.message}`);
        retries++;
  
        // You can add a page reload here if needed
        await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
}

module.exports = repackItems;
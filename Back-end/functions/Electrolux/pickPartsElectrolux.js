const pickPartsElectrolux = async (page, parts) => {
    const rows = await page.$$('tr.example-element-row');
    let num = 0;
  
    for (const row of rows) {
      // Extract part number and quantity from each row
      const partNumberInput = await row.$('input.mat-input-element');
  
      if (!partNumberInput) {
        console.log(`Skipping row ${num} - No partNumberInput`);
        continue;
      }
  
      const partNumber = await partNumberInput.evaluate(input => input.value.trim());
  
      num++;
      console.log(`Part Number: ${partNumber}`);
  
      // Check if the part number exists in the provided parts array
      const matchingPart = parts.find(part => part.partNo === partNumber);
  
      if (matchingPart) {
        const quantityInput = await row.$('.mat-column-totalQuantity input');
        // Extract and fill the quantity
        await quantityInput.click({ clickCount: 3 }); // Select all
        await quantityInput.press('Backspace');
        await quantityInput.type(`${matchingPart.quantity}`, { delay: 100 });
        console.log(`Typed quantity ${matchingPart.quantity}`);
      } else{
        // Extract and fill the quantity
        const quantityInput = await row.$('.mat-column-totalQuantity input');
        await quantityInput.click({ clickCount: 3 }); // Select all
        await quantityInput.press('Backspace');
        await quantityInput.type(`0`, { delay: 100 });
      }
    }

    await page.waitForTimeout(3000);
    await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > div.displayInlineBlock.col-lg-12.btnPosition > div:nth-child(1) > button:nth-child(1)');
    await page.click('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > div.displayInlineBlock.col-lg-12.btnPosition > div:nth-child(1) > button:nth-child(1)');
  };
  
  module.exports = pickPartsElectrolux;
  
  
  
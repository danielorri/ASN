const pickParts = async(page, parts, shipping) =>{
 for (const part of parts){
    if (!part.partNo || part.partNo.trim() === "") {
        continue; // Skip this part
      }
      console.log(`Looking Part no.${part.partNo} ...`);
     await page.waitForNavigation({ waitUntil: 'networkidle0' , timeout: 0}); // Wait for navigation
 
      // Wait for the "Add Order Line Item" button to be present
        await page.waitForSelector('button#_ktkuqc');
        await page.waitForTimeout(5000); 
      // Click the "Add Order Line Item" button for the current part
        await page.click('button#_ktkuqc');


    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.waitForSelector('input#_tlvs4b'); // Wait for the input field to appear
    await page.type('input#_tlvs4b', part.partNo);

    
    await page.waitForSelector('button#_72k3pb'); // Wait for the button to become visible
    await page.click('button#_72k3pb'); // Click the button

    await page.waitForTimeout(2000); 
    
    async function processRows() {
        const rows = await page.$$('tr.tableRow1');
        for (const row of rows) {
          const partNumberElement = await row.$('td:nth-child(7) a');
          if(partNumberElement){
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
                        console.log(`Part no.${part.partNo} selected`);
                        return true;
                    }
                    }
                } else {
                    const clickableElement = await row.$('td'); // You can adjust the selector to find the clickable element
                    if (clickableElement) {
                    await clickableElement.click();
                    console.log(`Part no.${part.partNo} selected`);
                    return true;
                    }
                }
                } else {
                  console.log(`Part no.${part.partNo} not found`);
                }
            } else {
              console.log(`Part no.${part.partNo} not found`);
               
            }
          } else {
          }
        }
      }

      let retries2 = 0;
      const maxRetries = 4;

      while (retries2 < maxRetries) {
        try {
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for navigation
            await page.waitForSelector('tr.tableRow1');
            const res = await processRows();
            if(res === true){
                break; // Break out of the loop on successful row processing
            } else {
                throw new Error("Part not found");
            }
        } catch (error) {
            console.log(`Part no.${part.partNo} not found`);
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth() + retries2, 0);
            const endDate = new Date(today.getFullYear(), today.getMonth() + retries2 + 1, 0);
            await page.waitForTimeout(2000);
            await page.waitForSelector('input#DF_l4uaq');
            await page.click('input#DF_l4uaq', { clickCount: 3 });
            await page.$eval('input#DF_l4uaq', (input) => (input.value = '')); // Clear the input field
            await page.type('input#DF_l4uaq', formatDate(startDate));
        
            await page.waitForTimeout(2000);
            // Wait for the second input and change its value to the end date
            await page.waitForSelector('input#DF_dq2syd');
            await page.click('input#DF_dq2syd', { clickCount: 3 });
            await page.$eval('input#DF_dq2syd', (input) => (input.value = '')); // Clear the input field
            await page.type('input#DF_dq2syd', formatDate(endDate));
            await page.waitForTimeout(2000);
        
            await page.waitForSelector('button#_72k3pb');
            await page.click('button#_72k3pb');
    
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

    try {
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitForSelector("button#_x0hhpb");
        await page.click("button#_x0hhpb"); 

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitForSelector("button#_uz6b3");
        await page.click("button#_uz6b3");
    } catch (error) {
        await page.waitForSelector("button#_x0hhpb");
        await page.click("button#_x0hhpb"); 
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitForSelector("button#_uz6b3");
        await page.click("button#_uz6b3");
    }
       
 }
}

module.exports = pickParts;
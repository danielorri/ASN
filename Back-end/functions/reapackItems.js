const handleCustomized = require("./helpers/handleCustomized");
const repack = require("./helpers/repack");

const repackItems = async(page, parts) =>{
    const maxRetries = 3;
    let retries = 0;
    let isClicked = false;
  
    while (retries < maxRetries && !isClicked) {
   try {
    try {
        await repack(page, parts);
    } catch (error) {
        console.log(error);
        try {
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(30000); 
            await repack(page, parts);
        } catch (error) {
            console.log("Repacked failed twice");
        }
    }

     await page.waitForSelector("button.nextButton.button-shape.button-focused");
     await page.click('button.nextButton.button-shape.button-focused');
     // handle customized
     try {
        await handleCustomized(page, parts);
     } catch (error) {
        console.log(error);
     }
 
     console.log("Repacked successful");
     await page.waitForTimeout(2000); 
     await page.waitForSelector("#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused");
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused');

     await page.waitForTimeout(2000); 
     await page.waitForSelector('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span',{timeout: 0});
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span');
     await page.waitForTimeout(30000); 
     console.log("Labels downloaded");
     try {
        await page.waitForSelector('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.reviewButton.button-shape.button-focused')
        await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.reviewButton.button-shape.button-focused');
     } catch (error) {
        await page.waitForSelector('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.reviewButton.button-shape.button-focused')
        await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.reviewButton.button-shape.button-focused');
     }
     

    
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
        // await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
}

module.exports = repackItems;
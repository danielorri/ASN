const handleCustomized = require("./helpers/handleCustomized");
const repack = require("./helpers/repack");
const { getIo } = require("../socketManager");



const repackItems = async(page, parts,socketId) =>{
    const maxRetries = 3;
    let retries = 0;
    let isClicked = false;
    const io = getIo();

    while (retries < maxRetries && !isClicked) {
   try {
    try {
        await repack(page, parts);
    } catch (error) {
        console.log(error);
        try {
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(30000); 
            await repack(page, parts, socketId);
        } catch (error) {
            io.to(socketId).emit('progressUpdate', { message: 'Repack failed Twice', progress: 80 });
        }
    }

     await page.waitForSelector("button.nextButton.button-shape.button-focused");
     await page.click('button.nextButton.button-shape.button-focused');
     // handle customized
     try {
        await handleCustomized(page, parts, socketId);
     } catch (error) {
        io.to(socketId).emit('progressUpdate', { message: 'Error repacking', progress: 80 });
     }
 
     io.to(socketId).emit('progressUpdate', { message: 'Saving...', progress: 86 });
     await page.waitForTimeout(2000); 
     await page.waitForSelector("#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused");
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > div > div.ui-lg-12.ui-md-12.ui-sm-12 > div:nth-child(1) > div > table > tbody > tr > td:nth-child(3) > button.nextButton.button-shape.button-focused');
     
     await page.waitForTimeout(2000); 
     await page.waitForSelector('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span',{timeout: 0});
     await page.click('#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > print-labels-step > review-treetable > div > print-pdf-button > span');
     await page.waitForTimeout(30000); 
     io.to(socketId).emit('progressUpdate', { message: 'Labels downloaded', progress: 90 });
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
     io.to(socketId).emit('progressUpdate', { message: 'Saved', progress: 95 });
     await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
     await page.waitForSelector('a#_lzc3hd');
     await page.click('a#_lzc3hd');
     io.to(socketId).emit('progressUpdate', { message: 'ASN succesful', progress: 100 });
     isClicked = true;
    } catch (error) {
        io.to(socketId).emit('progressUpdate', { message: 'Reload repacking', progress: 80 });
        retries++;
  
        // You can add a page reload here if needed
        // await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
}

module.exports = repackItems;
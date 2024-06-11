
const pickASPElectrolux = async (page, parts, shipping) => {
    await page.waitForSelector('#subitem_3 > li:nth-child(1) > a');
    await page.click('#subitem_3 > li:nth-child(1) > a');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    await page.waitForSelector('#factory-key > div > div.mat-select-arrow-wrapper');
    await page.click('#factory-key > div > div.mat-select-arrow-wrapper');
    

    await page.waitForSelector('#cdk-overlay-0 > div > div > mat-option');

    if(shipping.Customer === '9676'){
        await page.waitForSelector('#mat-option-4');
        await page.click('#mat-option-4');
    } else if (shipping.Customer === '10053'){
        await page.waitForSelector('#mat-option-7');
        await page.click('#mat-option-7');
    } else if (shipping.Customer === '10105'){
        await page.waitForSelector('#mat-option-5');
        await page.click('#mat-option-5');
    } else if (shipping.Customer === '9675'){
        await page.waitForSelector('#mat-option-6');
        await page.click('#mat-option-6');
    }

    await page.waitForTimeout(1000);
    await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card.mat-card-width.mat-card-padTB.filterMatCardHeight.mat-card > form > div > div > button');
    await page.click('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card.mat-card-width.mat-card-padTB.filterMatCardHeight.mat-card > form > div > div > button');

    // await page.waitForTimeout(1000);
    // await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card:nth-child(3) > button');
    // await page.click('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card:nth-child(3) > button');

    await page.waitForTimeout(5000);

    await page.waitForSelector('#AdvanceShipment > tbody > tr');
    const rows = await page.$$('#AdvanceShipment > tbody > tr');

    for (const row of rows){
        const aspNumberElement = await row.$(`td:nth-child(1)`);
            if(aspNumberElement){
              const aspNumber = await aspNumberElement.evaluate((element) => element.textContent.trim());
              if (aspNumber === shipping.PackingSLipID) {
                const clickableElement = await row.$(`td:nth-child(8) button`);
                      if (clickableElement) {
                          await clickableElement.click();
                        //   io.emit('progressUpdate', { message: `Part no.${part.partNo} selected`, progress: pt + eachPorcentage/2 });
                          break;
                      }
                      }
                  } 
    }


    await page.waitForTimeout(5000);

    await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > mat-card:nth-child(3) > div > button');
    await page.click('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > mat-card:nth-child(3) > div > button');
}

module.exports = pickASPElectrolux;
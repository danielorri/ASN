
const startASPElectrolux = async (page, parts, shipping) => {
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

    await page.waitForTimeout(1000);
    await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card:nth-child(3) > button');
    await page.click('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-asp > div.wrapper-container > mat-card:nth-child(3) > button');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    await page.waitForSelector('#ASP-key');
    await page.click('#ASP-key');

    await page.waitForTimeout(1000);
    // Wait for the element to be available in the DOM
    await page.waitForSelector('mat-option[ng-reflect-value="Pending"]');

    // Click on the element
    await page.click('mat-option[ng-reflect-value="Pending"]');


    await page.waitForTimeout(1000);
    await page.waitForSelector('#ToBeShipped');
    await page.type('#ToBeShipped', shipping.ShippingDate);

    await page.waitForTimeout(1000);
    await page.waitForSelector('#ShipFromTime');
    await page.type('#ShipFromTime', "02:00PM");

    await page.waitForTimeout(1000);
    await page.waitForSelector('#ShipToTime');
    await page.type('#ShipToTime',"04:00PM" );

    await page.waitForTimeout(1000);
    await page.waitForSelector('#ShippedTimeZoneCode-key > div > div.mat-select-value');
    await page.click("#ShippedTimeZoneCode-key > div > div.mat-select-value");

    await page.waitForTimeout(1000);
    // Wait for the element to be available in the DOM
    await page.waitForSelector('mat-option[ng-reflect-value="CST"]');

    // Click on the element
    await page.click('mat-option[ng-reflect-value="CST"]');

    await page.waitForTimeout(1000);
    await page.waitForSelector('#ToBeDelivered');
    await page.type('#ToBeDelivered', shipping.DeliveryDate);

    await page.waitForSelector('body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > mat-card:nth-child(3) > div > button');
    await page.click("body > app-root > app-sidebar > mat-sidenav-container > mat-sidenav-content > div > div > app-add-asp > div.wrapper-container > mat-card:nth-child(3) > div > button");
}

module.exports = startASPElectrolux;
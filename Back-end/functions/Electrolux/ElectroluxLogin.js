// login.js

const loginElextrolux = async (page, username, password, sendUpdateToClients ) => {
    await page.waitForSelector('#rhsCard > mat-card > div > div:nth-child(3) > button');
    await page.click('#rhsCard > mat-card > div > div:nth-child(3) > button');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    // Wait for the UserName input field to load
    await page.waitForSelector('#email');
    await page.type('#email', username);

    // Wait for the Password input field to load
    await page.waitForSelector('#password');
    // Fill in the Password input field
    await page.type('#password', password);

    // You can add additional login actions here, such as clicking the login button.
    // Find and click the "Login" button by its value or attribute
    await page.waitForSelector('#next');
    await page.click('#next');
    // Return a promise or data indicating the login status if necessary.

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForSelector('#parent_subitem_3');
    await page.click('#parent_subitem_3');
};

module.exports = loginElextrolux;
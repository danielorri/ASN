// login.js

const login = async (page, username, password, sendUpdateToClients ) => {
    // Wait for the UserName input field to load
    await page.waitForSelector('#userid');
    await page.type('#userid', username);

    await page.waitForSelector('#_czgbx > div > span');
    await page.click('#_czgbx > div > span');

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Wait for the Password input field to load
    await page.waitForSelector('#Password');
    // Fill in the Password input field
    await page.type('#Password', password);

    // You can add additional login actions here, such as clicking the login button.
    // Find and click the "Login" button by its value or attribute
    await page.waitForSelector('#_7bsq2d > div.loginFormBox > table > tbody > tr:nth-child(4) > td > input');
    await page.click('#_7bsq2d > div.loginFormBox > table > tbody > tr:nth-child(4) > td > input');
    // Return a promise or data indicating the login status if necessary.
};

module.exports = login;

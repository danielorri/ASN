
const login = async (page, username, password ) => {
    // Wait for the UserName input field to load
    await page.waitForSelector('#userid');
    await page.type('#userid', username);

    await page.waitForSelector('#_s0cve');
    await page.click('#_s0cve');

    await page.waitForNavigation({ waitUntil: 'networkidle0'  });

    // Wait for the Password input field to load
    await page.waitForSelector('#Password');
    // Fill in the Password input field
    await page.type('#Password', password);

    // You can add additional login actions here, such as clicking the login button.
    // Find and click the "Login" button by its value or attribute
    // Wait for the loader to disappear
    await page.waitForSelector('.fd-loading-dots', { hidden: true });

    // Wait for the login button to be visible and clickable
    await page.waitForSelector('.sbn-login-button', { visible: true });

    const loginButton = await page.$('.sbn-login-button');

    await loginButton.click();

    // Return a promise or data indicating the login status if necessary.
};

module.exports = login;

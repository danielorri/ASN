// login.js

const login = async (page, username, password, sendUpdateToClients ) => {
    // Wait for the UserName input field to load
    await page.waitForSelector('input[name="UserName"]');
    await page.type('input[name="UserName"]', username);

    // Wait for the Password input field to load
    await page.waitForSelector('input[name="Password"]');
    // Fill in the Password input field
    await page.type('input[name="Password"]', password);
    await page.click('input[name="UserName"]', { clickCount: 3 }); // Select all text
    await page.keyboard.press('Backspace'); // Clear the selected text
    await page.type('input[name="UserName"]', username);

    // You can add additional login actions here, such as clicking the login button.
    // Find and click the "Login" button by its value or attribute
    await page.waitForSelector('input[value="Login"]');
    await page.click('input[value="Login"]');
    // Return a promise or data indicating the login status if necessary.
};

module.exports = login;

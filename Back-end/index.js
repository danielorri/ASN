const express = require("express");
const cors = require("cors"); // Import the cors package
const puppeteer = require("puppeteer");
const login = require("./functions/login"); //Import Login function
const startASN = require("./functions/startASN"); //Import startASN function
const pickParts = require("./functions/pickParts");
const enterQuantity = require("./functions/enterQuantity");
const repackItems = require("./functions/reapackItems");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/buildASN", async(req, res)=>{
    const {parts, shipping, cookies} = req.body;
    // Split the cookies string by the semicolon to get individual key-value pairs
    const cookiePairs = cookies.split(';');

    // Initialize variables for username and password
    let username = '';
    let password = '';

    // Loop through the key-value pairs and extract the values
    for (const pair of cookiePairs) {
    const [key, value] = pair.trim().split('=');

    if (key === 'username') {
        username = value;
    } else if (key === 'password') {
        password = value;
    }
    }

    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: false
    });
    const page = await browser.newPage();
    
    await page.goto('https://service.ariba.com/Supplier.aw/109563048/aw?awh=r&awssk=0vRmwfqP&dard=1', 
    {waitUntil: "load"});
    //Login
    await login(page, username, password);

    //Start ASN
    await startASN(page,parts[0], shipping);
    if(parts.length > 1){
        await pickParts(page, parts.slice(1), shipping)
    }
    //Enter Quantities
    await enterQuantity(page, parts);

    await repackItems(page, parts.slice(0, -1));

    await browser.close();
});

app.listen(3010, () => {
    console.log(`Server is running on port 3010`);
  });
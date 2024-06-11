const express = require('express');
const router = express.Router();
const puppeteer = require("puppeteer");

//Functions
const loginElextrolux = require("../functions/Electrolux/ElectroluxLogin");
const startASPElectrolux = require("../functions/Electrolux/ASP/startASPElectrolux");
const pickPartsElectrolux = require("../functions/Electrolux/pickPartsElectrolux");

router.post("/", async(req, res) => {
    try {
      const { parts, shipping } = req.body;
    console.log("starting...");
  
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false
    });
  
    const page = await browser.newPage();
  
    await page.goto('https://supplierportal.electrolux-na.com/', { waitUntil: "load" });
  
    // Login
    await loginElextrolux(page, "dione.heppner@shamrockif.com", "Shamrock1475");
    
    await startASPElectrolux(page, parts, shipping);
  
    await pickPartsElectrolux(page, parts.slice(0, -1));
    } catch (error) {
      console.error('Error Electrolux Page');
      res.status(500).json({ error: 'Electrolux Portal Error' });
    }
  
  });

  module.exports = router;
const express = require('express');
const router = express.Router();
const puppeteer = require("puppeteer");
const { getIo } = require('../socketManager');

//functions
const login = require("../functions/login");
const startASN = require("../functions/startASN");
const pickParts = require("../functions/pickParts");
const enterQuantity = require("../functions/enterQuantity");
const repackItems = require("../functions/reapackItems");
const extractCredentials = require("../functions/helpers/extractCredentials");

router.post("/", async(req, res) => {
    try {
        const { parts, shipping, cookies } = req.body;
        const io = getIo();
        const socketId = req.header('socketId');
        io.to(socketId).emit('progressUpdate', { message: 'starting...', progress: 1 });

        // Extract username and password from cookies
        const { username, password } = extractCredentials(cookies);

        let pan1 = 7;
        let pan2 = 15;

        if(username.toLowerCase() === "geoff.speiden@shamrockint.com"){
          pan1 = 8;
          pan2 = 16;
        } else if (username.toLowerCase() === "dione.heppner@shamrockint.com"){
          pan1 = 5;
          pan2 = 13;
        }
      
        const browser = await puppeteer.launch({
          headless: false,
          defaultViewport: false
        });
      
        const page = await browser.newPage();
      
        await page.goto('https://service.ariba.com/Supplier.aw/109563048/aw?awh=r&awssk=0vRmwfqP&dard=1', { waitUntil: "load" });
      
        // Login
        await login(page, username, password);

        io.to(socketId).emit('progressUpdate', { message: 'Login Successful', progress: 5 });
      
        await startASN(page, parts[0], shipping, pan1, pan2, socketId);
      
        io.to(socketId).emit('progressUpdate', { message: 'Picking Parts', progress: 10 });

        if (parts.length > 1) {
          await pickParts(page, parts.slice(1), shipping, pan1, pan2, socketId);
        }
      
        io.to(socketId).emit('progressUpdate', { message: 'Entering Quantities', progress: 70 });
        // Enter Quantities
        await enterQuantity(page, parts, socketId);
      
        io.to(socketId).emit('progressUpdate', { message: 'Repacking', progress: 77 });
        await repackItems(page, parts.slice(0, -1), socketId);
      
        await browser.close();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
   
  });

  module.exports = router;
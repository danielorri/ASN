const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const login = require("./functions/login");
const startASN = require("./functions/startASN");
const pickParts = require("./functions/pickParts");
const enterQuantity = require("./functions/enterQuantity");
const repackItems = require("./functions/reapackItems");
const sql = require("mssql/msnodesqlv8");

var dbConnect = require("./dbConnect");


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
  try {
      // Use dbConnect instead of config
      const pool = await dbConnect;

      console.log('Connected to SQL Server');
      // ... rest of the code
  } catch (err) {
      console.error('Error connecting to SQL Server:', err);
      // ... handle the error
  }
});


app.post("/getParts",  async (req, res) => {
  try {
    // Use dbConnect instead of config
    const pool = await dbConnect;

    const { Customer, ShipTo, ShippingDate } = req.body;

    const result = await pool.request()
    .input('customerCode', sql.VarChar, Customer)
    .input('shipToCode', sql.VarChar, ShipTo)
    .input('dueDate', sql.Date, ShippingDate)
    .query(`
    SELECT
      ORDR.DocNum,
      RDR1.U_SIF_CustPN AS CustomerPart,
      CONVERT(INT, RDR1.Quantity) AS PartQuantity
    FROM
      SIF.dbo.ORDR ORDR
    JOIN
      SIF.dbo.RDR1 RDR1 ON ORDR.DocEntry = RDR1.DocEntry
    WHERE
      ORDR.CardCode = @customerCode
      AND ORDR.ShipToCode = @shipToCode
      AND ORDR.DocDueDate = @dueDate
    ORDER BY
      ORDR.DocNum,
      RDR1.U_SIF_CustPN;  
    `);
     // Organize the data into the desired structure
     const groupedData = result.recordset.reduce((acc, current) => {
      const existingDoc = acc.find(item => item.DocNum === current.DocNum);

      if (existingDoc) {
        existingDoc.Parts.push({
          CustomerPart: current.CustomerPart,
          PartQuantity: current.PartQuantity,
        });
      } else {
        acc.push({
          DocNum: current.DocNum,
          Parts: [{
            CustomerPart: current.CustomerPart,
            PartQuantity: current.PartQuantity,
          }],
        });
      }

      return acc;
    }, []);

    res.json(groupedData);
  } catch (err) {
    console.error('Error connecting to SQL Server:', err);
    // ... handle the error
  }
});



app.post("/buildASN", async(req, res) => {
  const { parts, shipping, cookies } = req.body;

  // Extract username and password from cookies
  const { username, password } = extractCredentials(cookies);

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: false
  });

  const page = await browser.newPage();

  await page.goto('https://service.ariba.com/Supplier.aw/109563048/aw?awh=r&awssk=0vRmwfqP&dard=1', { waitUntil: "load" });

  // Login
  await login(page, username, password);
  res.write(JSON.stringify({ progress: 10 }) + '\n');

  await startASN(page, parts[0], shipping);

  if (parts.length > 1) {
    await pickParts(page, parts.slice(1), shipping);
  }

  // Enter Quantities
  await enterQuantity(page, parts);

  await repackItems(page, parts.slice(0, -1));

  await browser.close();
});

app.listen(3010, () => {
  console.log(`Server is running on port 3010`);
});

function extractCredentials(cookies) {
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

  return { username, password };
}

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
const loginElextrolux = require("./functions/Electrolux/ElectroluxLogin");
const startASPElectrolux = require("./functions/Electrolux/ASP/startASPElectrolux");
const pickPartsElectrolux = require("./functions/Electrolux/pickPartsElectrolux");


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
    SELECT  ordr.DocNum 
	, RDR1.U_SIF_CustPN AS CustomerPart
	, SUM(case when PMX_PLLI.OpenQty = 0 then pmx_plli.QtyPicked else PMX_PLLI.OpenQty end) AS PartQuantity
FROM       PMX_PLLI PMX_PLLI
inner join PMX_PLPL on PMX_PLLI.BaseEntry = PMX_PLPL.DocEntry and PMX_PLLI.BaseLine = PMX_PLPL.LineNum
LEFT  JOIN  ORDR
	INNER JOIN  RDR1 ON ORDR."DocEntry" = RDR1."DocEntry"
	inner join RDR12 on ORDR.DocEntry = RDR12.DocEntry
ON PMX_PLPL."BaseType" = ORDR."ObjType" AND PMX_PLPL."BaseEntry" = RDR1."DocEntry" AND PMX_PLPL."BaseLine" = RDR1."LineNum"
WHERE    RDR1.ShipDate = @dueDate
	and ordr.ShipToCode = @shipToCode
	and ordr.CardCode = @customerCode
	--and pmx_plli.DocEntry = '8115'
GROUP BY ORDR.DocNum
	, RDR1.U_SIF_CustPN
ORDER BY ORDR.DocNum
	, RDR1.U_SIF_CustPN;

    `);
     // Organize the data into the desired structure
     const groupedData = result.recordset.reduce((acc, current) => {
      const existingDoc = acc.find(item => item.DocNum === current.DocNum);

      if (existingDoc) {
        if(current.PartQuantity > 0){
          existingDoc.Parts.push({
            CustomerPart: current.CustomerPart,
            PartQuantity: current.PartQuantity,
          });
        }
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

app.post("/buildASPElectrolux", async(req, res) => {
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

});


app.post("/buildASN", async(req, res) => {
  const { parts, shipping, cookies } = req.body;
  console.log("starting...");
  // Extract username and password from cookies
  const { username, password } = extractCredentials(cookies);

  const browser = await puppeteer.launch({
    headless: false,
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

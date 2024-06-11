const express = require("express");
const cors = require("cors");
//Routes
const dailyOrdersAPI = require('./Routes/dailyOrders');
const aribaRouter = require('./Routes/aribaRoute');
const getOrderPartsRoute = require('./Routes/getOrderPartsRoute');
const electroluxASPRoute = require('./Routes/electroluxASPRoute');
const certifateInfoRoute = require('./Routes/getCertificateInfo');
const electroluxReviseAspRoute = require('./Routes/electroluxReviseAspRoute');
const pdfRoute = require("./functions/Pdf/pdfRoute");
const inventoryRoute=require("./Routes/InventoryRoute");

var dbConnect = require("./dbConnect");

const { initializeSocket } = require('./socketManager');

const app = express();
app.use(cors({
  origin: "http://10.100.111.10:3000",
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(express.json());
const server = app.listen(3010, () => {
  console.log('Server is running on port 3010');
  initializeSocket(server); 
});




app.use('/dailyorders', dailyOrdersAPI);
app.use('/buildASN', aribaRouter);
app.use('/getParts', getOrderPartsRoute);
app.use('/buildASPElectrolux', electroluxASPRoute);
app.use('/resviseASPElectrolux', electroluxReviseAspRoute);
app.use('/certificateofcompliance', certifateInfoRoute);
app.use('/pdfhelper', pdfRoute);
app.use('/inventory', inventoryRoute);

app.get('/', async (req, res) => {
  try {
      // Use dbConnect instead of config
      const pool = await dbConnect;

      console.log('Connected to SQL Server');
      // ... rest of the code
  } catch (err) {
    console.error('Error connecting to SQL Server:', err);
    res.status(500).json({ error: 'Internal Server Error' });
      // ... handle the error
  }
});



module.exports = server;





// app.listen(3010, () => {
//   console.log(`Server is running on port 3010`);
// });


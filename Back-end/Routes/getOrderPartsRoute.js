const express = require('express');
const router = express.Router();
var dbConnect = require('../dbConnect');
const sql = require("mssql/msnodesqlv8");


router.post("/",  async (req, res) => {
    try {
      // Use dbConnect instead of config
      const pool = await dbConnect;
  
      const { Customer, ShipTo, ShippingDate } = req.body;

      let result;
      
      function getFormattedToday() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        return formattedDate;
      }

      if (Customer === "10053" || Customer === "9675" || Customer === '9676' || Customer === "10105" &&
      ShippingDate !== getFormattedToday()){
        result = await pool.request()
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
      } else {
         result = await pool.request()
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
        
      }
  
     
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
      
    }
  });

  module.exports = router;
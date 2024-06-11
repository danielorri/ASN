
const express = require('express');
const router = express.Router();
var dbConnect = require('../dbConnect');
const fs = require('fs');
const fastcsv = require('fast-csv');


router.get('/', async (req, res) => {
  try {
    const pool = await dbConnect;

    const shipDate = req.query.shipDate;

    const readCsv = (filePath) => {
        return new Promise((resolve, reject) => {
            let data = [];
            fs.createReadStream(filePath)
                .pipe(fastcsv.parse({ headers: true }))
                .on('error', error => reject(error))
                .on('data', row => data.push(row))
                .on('end', () => resolve(data));
        });
    };
    
    const csvFilePath = 's:\\WHSE\\Whse Tools\\DailyOrdersData\\daily_orders_data.csv';
    const csvData = await readCsv(csvFilePath);
    // Filter data based on shipDate after reading all data
    const mainCsvData = csvData.filter(row => row.ShipDate.includes(shipDate));
    const filteredCsvData = mainCsvData.map(row => ({
        ...row,
        'Picklist Status': row['Picklist Status'] !== 'Not Allocated' ? 'Shipped' : row['Picklist Status']
    }));
    
    // Step 1: Read and filter the CSV data
    const result = await pool.request().input('shipDate1', shipDate) .query(`
    SELECT 
    ordr.DocNum,
    ordr.CardCode,
    ordr.ShipToCode,
    ordr.CardName,
    rdr1.ShipDate,
    SUM(subquery2.CTNS) AS 'Cartons',
    CASE 
        WHEN ordr.Weight < (
            SELECT TOP 1 CRD1.U_SINT_WtCut
            FROM CRD1 
            INNER JOIN OCRD ON CRD1.CardCode = OCRD.CardCode 
            WHERE CRD1.CardCode = ORDR.CardCode 
                AND crd1.Address = ordr.ShipToCode
        ) THEN 0 
        ELSE 
            CASE 
                WHEN SUM(subquery2.CTNS) > 10 THEN
                    CASE 
                        WHEN SUM(subquery2.SKIDS) - FLOOR(SUM(subquery2.SKIDS)) >= 0.1 THEN CEILING(SUM(subquery2.SKIDS))
                        ELSE FLOOR(SUM(subquery2.SKIDS))
                    END
                ELSE 0
            END
    END AS 'SKIDS',
    ordr.Weight,
    MIN(subquery2.U_SIF_CustPN) AS 'PART',
    'TBD' AS 'CARRIER',
    ORDR.U_SIF_ShipInst1,
    ORDR.U_SIF_ShipInst2,
    (
        SELECT TOP 1 
            CASE 
                WHEN PMX_PLHE.PickListStatus = 'N' THEN 'Not Ready'
                WHEN PMX_PLHE.PickListStatus = 'K' THEN 'Picked'
                WHEN PMX_PLHE.PickListStatus = 'I' THEN 'Partially Picked'
                WHEN PMX_PLHE.PickListStatus = 'S' THEN 'Shipped'
            END
        FROM PMX_PLPL 
        LEFT JOIN PMX_PLLI ON PMX_PLPL.LineNum = PMX_PLLI.BaseLine AND PMX_PLPL.DocEntry = PMX_PLLI.BaseEntry AND PMX_PLLI.LineStatus = 'O'
        LEFT JOIN PMX_PLHE ON PMX_PLLI.DocEntry = PMX_PLHE.DocEntry 
        WHERE ORDR.DOCENTRY = PMX_PLPL.BaseEntry AND PMX_PLPL.LineStatus = 'O'
    ) AS 'Picklist Status',
    CASE 
        WHEN MIN(instructions.U_SINT_FFonBOL) = 'Yes' THEN 
            MIN(
                CASE WHEN instructions.U_SINT_FFBillName IS NOT NULL THEN instructions.U_SINT_FFBillName + ' ' ELSE '' END +
                CASE WHEN instructions.U_SINT_FFAdd1 IS NOT NULL THEN instructions.U_SINT_FFAdd1 + ' ' ELSE '' END +
                CASE WHEN instructions.U_SINT_FFAdd2 IS NOT NULL THEN instructions.U_SINT_FFAdd2 + ' ' ELSE '' END +
                CASE WHEN instructions.U_SINT_FFCity IS NOT NULL THEN instructions.U_SINT_FFCity + ' ' ELSE '' END +
                CASE WHEN instructions.U_SINT_FFZip IS NOT NULL THEN instructions.U_SINT_FFZip ELSE '' END
            )
        ELSE ORDR.Address2
    END AS 'Address',
    ordr.U_SIF_PO_Sample,
    MIN(CAST(instructions.U_SINT_InstrNotes AS NVARCHAR(MAX))) AS 'Ship Instruction Notes',
    MIN(CAST(instructions.U_SINT_BOLNotes AS NVARCHAR(MAX))) AS 'BOL Notes',
    MIN(CAST(instructions.U_SINT_WtCut AS NVARCHAR(MAX))) AS 'Weight Cut-off',
    MIN(CAST(instructions.U_SINT_LitePorC AS NVARCHAR(MAX))) AS 'Light-Weight Payment',
    MIN(CAST(instructions.U_SINT_HeavyPorC AS NVARCHAR(MAX))) AS 'Heavy-Weight Payment',
    MIN(CAST(instructions.U_SINT_SmallCarrier AS NVARCHAR(MAX))) AS 'Light-Weight Carrier',
    MIN(CAST(instructions.U_SINT_SCAccount AS NVARCHAR(MAX))) AS 'Light-Weight Carrier Acct',
    MIN(CAST(instructions.U_SINT_LTLCarrier AS NVARCHAR(MAX))) AS 'LTL Carrier'
FROM 
    ordr 
    INNER JOIN rdr1 ON ordr.DocEntry = rdr1.DocEntry
    LEFT JOIN (
        -- Subquery for CTNS calculation (subquery2)
        SELECT 
            RDR1.DocEntry AS SODocEntry,
            RDR1.LineNum AS SOLineNum,
            RDR1.U_SIF_CustPN,
            CEILING(RDR1.Quantity / (SELECT TOP 1 SalFactor1 FROM OITM WHERE OITM.ItemCode = RDR1.ItemCode)) AS "CTNS",
            (RDR1.Quantity / (SELECT TOP 1 SalFactor1 FROM OITM WHERE OITM.ItemCode = RDR1.ItemCode)) / (SELECT TOP 1 SalFactor2 FROM OITM WHERE OITM.ItemCode = RDR1.ItemCode) AS "SKIDS"
        FROM RDR1
    ) subquery2 ON ordr.DocEntry = subquery2.SODocEntry AND rdr1.LineNum = subquery2.SOLineNum
    LEFT JOIN (
        SELECT 
            CRD1.CardCode,
            CRD1.Address,
            CRD1.U_SINT_InstrNotes,
            CRD1.U_SINT_BOLNotes,
            CRD1.U_SINT_WtCut,
            CRD1.U_SINT_LitePorC,
            CRD1.U_SINT_HeavyPorC,
            CRD1.U_SINT_SmallCarrier,
            CRD1.U_SINT_SCAccount,
            CRD1.U_SINT_LTLCarrier,
            CRD1.U_SINT_FFonBOL,
            CRD1.U_SINT_FFBillName,
            CRD1.U_SINT_FFAdd1,
            CRD1.U_SINT_FFAdd2,
            CRD1.U_SINT_FFCity,
            CRD1.U_SINT_FFZip
        FROM CRD1
        INNER JOIN OCRD ON CRD1.CardCode = OCRD.CardCode
        WHERE CRD1.AdresType = 'S'
            AND CRD1.Address <> 'Blank'
            AND OCRD.CardType = 'C'
    ) instructions ON ordr.CardCode = instructions.CardCode AND ordr.ShipToCode = instructions.Address
WHERE 
    rdr1.LineStatus = 'O' 
    AND ordr.DocType = 'I' 
    AND rdr1.ShipDate = @shipDate1 
GROUP BY 
    ordr.DocNum,
    ordr.CardCode,
    ordr.ShipToCode,
    rdr1.ShipDate,
    ordr.Weight,
    ORDR.DOCENTRY,
    ordr.CardName,
    ORDR.Address2,
    ORDR.U_SIF_ShipInst1,
    ORDR.U_SIF_ShipInst2,
    ordr.U_SIF_PO_Sample
ORDER BY 
    ordr.U_SIF_PO_Sample,
    ordr.CardCode,
    CASE 
        WHEN ordr.Weight > MIN(CAST(instructions.U_SINT_WtCut AS NVARCHAR(MAX))) 
            AND UPPER(MIN(CAST(instructions.U_SINT_LTLCarrier AS NVARCHAR(MAX)))) LIKE '%SEE%' OR
            UPPER(MIN(CAST(instructions.U_SINT_LTLCarrier AS NVARCHAR(MAX)))) LIKE '%PENSKE%' OR
            UPPER(MIN(CAST(instructions.U_SINT_LTLCarrier AS NVARCHAR(MAX)))) LIKE '%MILKRUN%'
        THEN 1
        ELSE 0
    END, 
    (
        SELECT TOP 1 
            CRD1.U_SINT_LTLCarrier
        FROM CRD1 
        INNER JOIN OCRD ON CRD1.CardCode = OCRD.CardCode 
        WHERE CRD1.CardCode = ORDR.CardCode 
            AND crd1.Address = ordr.ShipToCode
    ),  
    ordr.ShipToCode, ordr.DocNum;
    `);

    const dbData = result.recordsets[0];
    const combinedData = [...filteredCsvData];
    dbData.forEach(dbRecord => {
        const foundIndex = filteredCsvData.findIndex(csvRecord => 
            csvRecord.DocNum === dbRecord.DocNum.toString().trim()
        );
    
        if (foundIndex !== -1) {
            // If found, update the 'Status' field of the corresponding record in combinedData
            combinedData[foundIndex] = {
                ...combinedData[foundIndex],
                'Picklist Status': dbRecord['Picklist Status'] // Assuming 'Status' is the field you want to update from dbRecord
            };
        } else {
            // If not found, add the dbRecord to combinedData
            combinedData.push(dbRecord);
        }
    });

    res.json(combinedData);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/insert-csv', async(req, res) => {
    const newData = req.body;
    // Validate newData here, ensure it has all the required fields
    const csvFilePath = 's:\\WHSE\\Whse Tools\\DailyOrdersData\\daily_orders_data.csv';
    let csvData = [];  // Initialize csvData

    const readCsv = (filePath) => {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            let data = [];
    
            stream
                .pipe(fastcsv.parse({ headers: true }))
                .on('error', (error) => {
                    console.log("Error while reading CSV:", error);
                    stream.close(); // Close the stream on error
                    reject(error);
                })
                .on('data', (row) => {
                    data.push(row);
                })
                .on('end', () => {
                    stream.close(); // Ensure to close the stream
                    resolve(data);
                });
        });
    };
    
    // Read CSV data
    csvData = await readCsv(csvFilePath);

   
        // Process newData - assuming it is an array of objects
        newData.forEach(updateData => {
            updateData.DocNum = updateData.DocNum.toString().trim();
            // console.log(`Processing update for DocNum: '${updateData.DocNum}'`);

            // Use manual method to find the index
            let foundIndex = -1;
            for (let i = 0; i < csvData.length; i++) {
                if (csvData[i].DocNum === updateData.DocNum) {
                    foundIndex = i;
                    // console.log(`Match found for DocNum: '${csvData[i].DocNum}' at index: ${i}`);
                }
            }

            if (foundIndex !== -1) {
                csvData[foundIndex] = { ...csvData[foundIndex], ...updateData };
                // console.log(csvData[foundIndex]);
            } else {
                // console.log(`No match found. Adding new entry for DocNum: '${updateData.DocNum}'`);
                csvData.push(updateData);
            }
    });
    // Write the updated data back to the CSV file
    const ws = fs.createWriteStream(csvFilePath);
    let responseSent = false; // Flag to control response status

    const stream = fastcsv
        .write(csvData, { headers: true, includeEndRowDelimiter: true })
        .pipe(ws);

    stream.on('finish', () => {
        if (!responseSent) {
            res.status(200).json(newData);
            responseSent = true;
            stream.close(); // Ensure to close the stream
        }
    });

    stream.on('error', error => {
        console.error('Stream error:', error);
        if (!responseSent) {
            res.status(500).send("Error writing CSV");
            responseSent = true;
            stream.close(); // Ensure to close the stream
        }
    });
});


module.exports = router;

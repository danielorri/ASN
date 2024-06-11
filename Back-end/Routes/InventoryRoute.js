const express = require('express');
const router = express.Router();
var dbConnect = require('../dbConnect');


router.get('/', async (req, res) => {
  try {
    const pool = await dbConnect;

    const result = await pool.request().query(`
    select PMX.ItemCode
	, PMX.BatchNumber1 AS 'Batch'
	, PMX.Warehouse
	, PMX.StorLocCode as 'Bin'
	, Sum(PMX.Quantity) as 'Quantity'
	, COUNT(PMX.QUANTITY) AS 'Ctn Count'
	, PMX.Quantity AS 'PackSize'
	, OITM.SalFactor1 AS 'Std Ctn Qty'
	, PMX_OSEL.PmxZoneCode AS 'Zone'
	, pmx.LicensePlate
from PMX_INVENTORY_REPORT_DETAIL_SINT PMX
	INNER JOIN OITM ON PMX.ItemCode = OITM.ItemCode
	INNER JOIN PMX_OSEL ON PMX.StorLocCode = PMX_OSEL.Code
GROUP BY PMX.ItemCode
	, PMX.BatchNumber1
	, PMX.Warehouse
	, PMX.StorLocCode
	, PMX.Quantity
	, OITM.SalFactor1
	, PMX_OSEL.PmxZoneCode
	, pmx.LicensePlate
    `);

    // Send the result as JSON response
    res.json(result.recordsets[0]);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/consolidation', async(req, res) =>{
    try{
        const pool = await dbConnect;

        const result = await pool.request().query(`
        SELECT
        PMX.StorLocCode AS 'Bin',
        COUNT(PMX.Quantity) AS 'Ctn Count',
        COUNT(DISTINCT PMX.ItemCode) AS 'Item Count',
        COUNT(DISTINCT PMX.BatchNumber1) AS '# Batches',
        PMX_OSEL.PmxZoneCode AS 'Zone',
        (60 - COUNT(PMX.Quantity)) AS 'Spaces',
        CASE WHEN COUNT(DISTINCT PMX.ItemCode) = COUNT(DISTINCT PMX.BatchNumber1) THEN 'Ok' ELSE 'Problem' END AS 'Status'
        FROM
        PMX_INVENTORY_REPORT_DETAIL_SINT PMX
        INNER JOIN PMX_OSEL ON PMX.StorLocCode = PMX_OSEL.Code
        GROUP BY
        PMX.StorLocCode,
        PMX_OSEL.PmxZoneCode`);

        res.json(result.recordsets[0]);
} catch (error) {
  console.error('Error executing SQL query:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}

});

router.get('/locked', async(req, res) =>{
    try{
        const pool = await dbConnect;

        const result = await pool.request().query(`
        select PMX_INLD.ItemCode
        , sum(PMX_INLD.Quantity) as 'Quantity'
        --, pmx_inld.quantity
        , case when pmx_inld.BaseType is null then 'Customer Lock'
            else 'Picklist'
        end [Lock Type]
        , CASE WHEN PMX_INLD.BaseType IS NULL THEN CAST(PMX_INLD.CardCode AS VARCHAR)
          ELSE CAST(PMX_INLD.BaseEntry AS VARCHAR)
        end as [Customer/Picklist #]
        , pmx_itri.BatchNumber
        ,pmx_invt.storloccode as 'Location'
    from pmx_inld inner join PMX_ITRI on pmx_inld.ItemTransactionalInfoKey = pmx_itri.InternalKey
        left join pmx_invt on pmx_inld.LogUnitIdentKey = pmx_invt.LogUnitIdentKey
    group by PMX_INLD.ItemCode
        , pmx_inld.BaseType
        , PMX_INLD.BaseEntry
        , pmx_itri.BatchNumber
        , PMX_INLD.CardCode, pmx_invt.storloccode
    order by [Lock Type]
        , [Customer/Picklist #]
        , PMX_INLD.ItemCode
        , PMX_ITRI.BatchNumber
        , pmx_invt.storloccode`);

        res.json(result.recordsets[0]);
} catch (error) {
  console.error('Error executing SQL query:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}

})

module.exports = router;

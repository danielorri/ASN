const express = require('express');
const router = express.Router();
const dbConnect = require('../dbConnect');

router.get('/', async (req, res) => {
  try {
    const pool = await dbConnect;

    const orderNum = req.query.orderNum;

    const resultQuery1 = await pool
      .request()
      .input('orderNum', orderNum)
      .query(`
      SELECT 
      SUM(pmx_plli.Quantity) AS 'Quantity',
      COUNT(pmx_plli.ItemCode) AS 'Ctns',
      PMX_ITRI.BatchNumber,
      ordr.DocNum,
      OPOR.DOCNUM AS 'PO Number',
      Vendor.Country AS 'COO',
      ocrd.CardName,
      rdr1.U_SIF_CustPN,
      CASE WHEN 
    rdr1.U_SIF_CustPartRev IS NULL THEN '0' ELSE 
    rdr1.U_SIF_CustPartRev END AS 'Rev',
      rdr1.ItemCode,
      oinv.DocNum AS 'Invoice Num'
  FROM pmx_plli
  INNER JOIN pmx_itri ON pmx_plli.ItemTransactionalInfoKey = pmx_itri.InternalKey
  INNER JOIN pmx_plpl ON pmx_plli.BaseEntry = pmx_plpl.DocEntry AND pmx_plli.BaseLine = pmx_plpl.LineNum
  INNER JOIN ordr ON PMX_PLPL.BaseEntry = ordr.DocEntry
  LEFT JOIN rdr1 ON ordr.DocEntry = rdr1.DocEntry
  LEFT JOIN ocrd ON ordr.CardCode = ocrd.CardCode
  LEFT JOIN dln1 ON rdr1.DocEntry = dln1.BaseEntry AND rdr1.LineNum = dln1.BaseLine
  LEFT JOIN inv1 ON dln1.DocEntry = inv1.BaseEntry AND dln1.LineNum = inv1.BaseLine
  LEFT JOIN oinv ON inv1.DocEntry = oinv.DocEntry
  LEFT JOIN IBT1_LINK ON IBT1_LINK.BatchNum = PMX_ITRI.BatchNumber
  LEFT JOIN OPDN ON IBT1_LINK.BASENUM = OPDN.DocNum
  LEFT JOIN PDN1 ON OPDN.DOCENTRY = PDN1.DOCENTRY AND IBT1_LINK.BASELINNUM = PDN1.LineNum
  LEFT JOIN OPOR ON PDN1.BaseDocNum = OPOR.DocNum
  LEFT JOIN POR1 ON PDN1.BaseLine = POR1.LineNum AND OPOR.DocEntry = POR1.DocEntry
  LEFT JOIN PCH1 ON OPDN.DocNum = PCH1.BaseDocNum AND PDN1.LineNum = PCH1.BaseLine
  LEFT JOIN OPCH ON PCH1.DOCENTRY = OPCH.DOCENTRY
  LEFT JOIN IPF1 ON PDN1.DocEntry = IPF1.BaseEntry AND PDN1.LineNum = IPF1.BaseRowNum
  LEFT JOIN OCRD AS Vendor ON OPOR.CardCode = Vendor.CardCode
  WHERE ordr.DocNum = @orderNum and IBT1_LINK.BaseType = 20
  GROUP BY
      pmx_plli.ItemCode,
      PMX_ITRI.BatchNumber,
      ordr.DocNum,
      OPOR.DOCNUM,
      Vendor.Country,
      ocrd.CardName,
      rdr1.U_SIF_CustPN,
      rdr1.U_SIF_CustPartRev,
      rdr1.ItemCode,
      oinv.DocNum;
      `);

    res.json(resultQuery1.recordsets[0]);
  } catch (error) {
    console.error('Error executing SQL queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

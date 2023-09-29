const handleCustomized = async (page, parts) => {
  await page.waitForSelector('table.undefined');

  const tableGroups = await page.$$eval('table.undefined', tables => {
    return tables.map(outerTable => {
      const rows = [...outerTable.querySelectorAll('.ui-treetable-row')];

      return rows.map(row => {
        const inputs = [...row.querySelectorAll('.ui-editable-column[disabled]')];
        return inputs.map(input => input.value);
      });
    });
  });

  console.log('Grouped input values:', tableGroups);
};

module.exports = handleCustomized;







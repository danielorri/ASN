const handleCustomized = async (page, parts) => {
  await page.waitForSelector('table.undefined');

  const tableGroups = await page.$$eval('table.undefined', tables => {
    return tables.map(table => {
      const inputs = [...table.querySelectorAll('.ui-editable-column[disabled]')];
      return inputs.map(input => input.value);
    });
  });

  console.log('Grouped input values:', tableGroups);
};

module.exports = handleCustomized;




const handleCustomized = async (page, parts) => {
  await page.waitForSelector('input.ui-editable-column.input.ng-untouched.ng-pristine');
  const elements = await page.$$('input.ui-editable-column.input.ng-untouched.ng-pristine');

   // Array to store values
   const values = [];

   // Iterate over the selected elements and push their values into the array
   for (const element of elements) {
     const value = await page.evaluate(el => el.value, element);
     values.push(value);
   }

   let count = 0;

   for(let i = 0; i < parts.length; i++){
    innerLoop:for(let j = 0; j < parts[i].customized.length; j++){
      if(parseInt(values[count]) === parseInt(parts[i].customized[j])){
        console.log(`${values[count]} is equal to ${parts[i].customized[j]}`);
      }else{
        console.log(`${values[count]} is different to ${parts[i].customized[j]}`);
        count += parts[i].customized.length - j;
        await page.waitForSelector('input.ui-dropdown-button.ui-button-70');
        const buttons = await page.$$('input.ui-dropdown-button.ui-button-70');
        await buttons[i].click();

        await page.waitForSelector("input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid");
        const editableInputs = await page.$$("input.ui-editable-column.input.ng-untouched.ng-pristine.ng-valid");

        for(const input of editableInputs){
          await input.click({ clickCount: 3 }); // Triple-click to select all text
          await input.press('Backspace'); // Clear the selected text
          await input.type(`${parts[i].customized[j]}`);
          j++;
        }
        await page.waitForTimeout(2000);
        // Click the "Save" button
        await page.waitForSelector('input[value="Save"]');
        const saveButton = await page.$('input[value="Save"]');
        await saveButton.click();
        await page.waitForTimeout(2000);
        break innerLoop;
      }
      count++;
    }
   }
 
};


module.exports = handleCustomized;








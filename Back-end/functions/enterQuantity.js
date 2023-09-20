const enterQuantity = async(page, parts) =>{
try {
       // Wait for the input element to appear on the page
       await page.waitForSelector(`input.w-txt`);
       const elements = await page.$$(`input.w-txt`);

       if (elements.length > 0) {
         for (const element of elements) {
           const value = await page.evaluate(el => el.value, element);
           
           // Check if the value is a positive number with commas or dots
           if (/^[0-9]+([,.][0-9]+)?$/.test(value)) {
             await page.evaluate(el => {
               // Replace the value with 1000
               el.value = '1000';
             }, element);
             
             // Log the modified value
             console.log('Value (Modified): 1000');
           }
         }
       } else {
         console.log('No elements with class "w-txt" found.');
       }

} catch (error) {
    console.log("Not found");
}
};

module.exports = enterQuantity;
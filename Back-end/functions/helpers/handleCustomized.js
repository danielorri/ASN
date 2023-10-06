const handleCustomized = async (page, parts) => {
  const generateSelector = (partIndex, tableIndex, inputIndex) => {
    return `#_lnmufb > table > tbody > tr > td > app-scc-shipnotice-packaging > div > app-scc-shipnotice-packaging-view > div > div > pe-steps > pe-step > div > app-confirm-step > review-treetable > p-panel > div > div > div > p-treetable > div > div > table > tbody:nth-child(${tableIndex}) > div:nth-child(${partIndex}) > td > table > tbody > div:nth-child(${inputIndex}) > td > table > tbody > div > td:nth-child(5) > span > input`;
  };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    for (let j = 0; j < part.customized.length; j++) {
      // Generate selectors based on the structure of your HTML
      const selectorForInput = generateSelector(i + 1, 2 + j, 2);

      // Use page.$ to get the element handle
      const inputElementHandle = await page.$(selectorForInput);

      // Extract the value using getProperty
      const inputValueProperty = await inputElementHandle.getProperty('value');

      // Extract the actual value from the property
      const valueOfInput = await inputValueProperty.jsonValue();

      // Console log the value
      console.log(`Part ${i + 1}, Input ${j + 1}:`, valueOfInput);

      // You can now compare the value with the corresponding part.customized value
      // Your comparison logic goes here
      if (part.customized[j] === valueOfInput) {
        // Do something
      }
    }
  }
};

module.exports = handleCustomized;








const Repack = (quantity, repackedQuantity) => {
  if (!isNaN(quantity) && !isNaN(repackedQuantity) && repackedQuantity !== 0) {
    const result = [];
    let remainingQuantity = quantity;

    while (remainingQuantity > 0) {
      if (remainingQuantity >= repackedQuantity) {
        result.push(repackedQuantity);
        remainingQuantity -= repackedQuantity;
      } else {
        result.push(remainingQuantity);
        remainingQuantity = 0;
      }
    }

    return result;
  } else {
    return [];
  }
};

export default Repack;


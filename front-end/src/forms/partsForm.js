import "./partsForm.css";


const PartForm = (props) => {
 
  return (
    <div className="Form partsForm">
      <h2>Part Details</h2>
      {/* <button onClick={props.handleRepack}>Repack All</button> */}
      <table>
        <thead>
          <tr>
            <th>Part No.</th>
            <th>Quantity</th>
            <th>Mixed or Master</th>
            <th>Repacked Quantity</th>
            {/* <th>Cartons</th> */}
          </tr>
        </thead>
        <tbody>
          {props.parts.map((part, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="partNo"
                  value={part.partNo}
                  onChange={(e) => props.handleInputChange(e, index)}
                />
              </td>
              <td>
                <input
                  name="quantity"
                  value={part.quantity}
                  onChange={(e) => props.handleInputChange(e, index)}
                />
              </td>
              <td>
              <select
                  name="mixedOrMaster"
                  value={part.mixedOrMaster}
                  onChange={(e) => props.handleInputChange(e, index)}
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Master">Master</option>
                </select>
              </td>
              <td>
                <input
                  name="repackedQuantity"
                  value={part.repackedQuantity}
                  onChange={(e) => props.handleInputChange(e, index)}
                />
              </td>
              {/* <td>
                {props.editModes[index] ? (
                  part.customized.map((value, subIndex) => (
                    <input
                      key={subIndex}
                      type="number"
                      name={`editedCustomized-${subIndex}`}
                      value={value}
                      onChange={(e) => props.handleEditCustomizedChange(e, index, subIndex)}
                    />
                  ))
                ) : (
                  part.customized.join(", ")
                )}
              </td>
              <td>
                {props.editModes[index] ? (
                  <button onClick={() => props.handleCheckTotal(index)}>OK</button>
                ) : (
                  <button onClick={() => props.handleEditPart(index)}>Edit</button>
                )}
              </td> */}
              <td>
                <button onClick={() => props.handleRemovePart(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartForm;

import { useState, useEffect } from "react";
import PartForm from "../forms/partsForm";
import ShippingForm from "../forms/shippingForm";
import Repack from "../FunctionHelpers/repackFunction";
import getParts from "../FunctionHelpers/getParts";

const Dashboard = ()=>{
  // const [progress, setProgress] = useState(0);
  // const [message, setMessage] = useState("");

  useEffect(() => {
   
  }, []); 

    //Shipping
    const initialShippingValues= {
        PackingSLipID: "",
        ShippingDate: "",
        DeliveryDate: "",
        CarrierName: "",
        TrackingNo: "",
        PlantCode: "",
        Customer: "",
        ShipTo: ""
    };
    const [shipping, setShipping] = useState(initialShippingValues);
    const [isPartsClicked, setIsPartsClicked] = useState(false);

    const handleShippingChange = (e) =>{
        const { name, value }= e.target;
        const generatedPackingSLipID = value.replace(/\//g, ''); 
        if(name === 'ShippingDate'){
          setShipping({ ...shipping, [name]: value, PackingSLipID: generatedPackingSLipID});
        } else{
          setShipping({ ...shipping, [name]: value});
        }
    }

    //Part
    const initialPart = {
        partNo: "",
        quantity: "",
        mixedOrMaster: "Mixed",
        repackedQuantity: "",
        customized:[]
      };
    
      const [parts, setParts] = useState([initialPart]);
    
      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedParts = [...parts];
        updatedParts[index][name] = value;
    
         // Automatically set the "Repacked Quantity" to the same value as "Quantity"
         if (name === "quantity") {
            updatedParts[index].repackedQuantity = value;
          }

         // Add a new row if the user is typing in the first field of the last row
         if (index === updatedParts.length - 1 && name === "partNo" && value.trim() !== "") {
            updatedParts.push({
                partNo: "",
                quantity: "",
                mixedOrMaster: "Mixed",
                repackedQuantity: "",
                customized:[]
              });
          }
    
        setParts(updatedParts);
      };
    
      const handleRemovePart = (index) => {
        const updatedParts = [...parts];
    
        
          updatedParts.splice(index, 1);
        
    
        setParts(updatedParts);
      };

      //Packages
      
      const [editModes, setEditModes] = useState(new Array(parts.length).fill(false));

      const handleEditPart = (index) => {
        const newEditModes = [...editModes];
        newEditModes[index] = !newEditModes[index];
        setEditModes(newEditModes);
      };
      
      // Function to handle changes in individual customized inputs
      const handleEditCustomizedChange = (e, index, subIndex) => {
        const { value } = e.target;

      // Create a deep copy of the current parts state
      const updatedParts = [...parts];

      // Update the customized value for the specified part
      updatedParts[index].customized[subIndex] = parseFloat(value);

      // Set the updated parts state
      setParts(updatedParts);
      };

      // Function to check if the edited values equal the total quantity
      const handleCheckTotal = (index) => {
        const part = parts[index];
      
        // Calculate the total quantity based on customized values
        const totalQuantity = part.customized.reduce((acc, value) => acc + value, 0);

        // Check if the total quantity matches the original quantity
        if (totalQuantity === parseFloat(part.quantity)) {
          // If they match, exit edit mode if needed
          if (editModes[index]) {
            handleEditPart(index); // Exit edit mode
          }
        } else {
          // If they don't match, you can handle the error or display a message
          alert("Total quantity does not match.");
        }
      };
      //Handle Repack
      const handleRepack = () => {
        const updatedParts = [...parts];
        updatedParts.forEach((part, index) => {
          if (part.quantity && part.repackedQuantity) {
            updatedParts[index].customized = Repack(parseFloat(part.quantity), parseFloat(part.repackedQuantity));
          } else {
            updatedParts[index].customized = []; // Reset if either quantity or repackedQuantity is missing
          }
        });
      
        setParts(updatedParts);
      };
      
      //SubmitASN
      // State to store the response from the server
  const [serverResponse, setServerResponse] = useState("");

  // Function to handle the submit button click
  const handleSubmit = async () => {
    try {
      // Prepare the data to send to the server
      const dataToSend = {
        parts,
        shipping,
        cookies: document.cookie, // Replace with your actual cookie data
      };

      // Send a POST request to the server
      const response = await fetch("http://localhost:3010/buildASN", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Check if the response is successful (you can modify the condition)
      if (response.status === 200) {
        const responseData = await response.json();
        // Handle the response data as needed
        setServerResponse(responseData.message);
      } else {
        // Handle error responses
        setServerResponse("Error: Failed to submit data to the server");
      }
    } catch (error) {
      // Handle any network or other errors
      console.error("Error:", error);
      setServerResponse("Error: Something went wrong");
    }
  };

  //get Parts
  const handleGetParts = async () => {
    try {
      const orders = await getParts(shipping);

      const transformedParts = orders.flatMap(order => {
        const isMixed = order.Parts.length === 1;
        const mixedOrMaster = isMixed ? "Master" : "Mixed";

        return order.Parts.map(part => ({
          partNo: part.CustomerPart,
          quantity: part.PartQuantity,
          mixedOrMaster,
          repackedQuantity: part.PartQuantity,
          customized: [],
        }));
      });

      // Add an empty object to the transformedParts array
      transformedParts.push({
        partNo: "",
        quantity: "",
        mixedOrMaster: "Mixed",
        repackedQuantity: "",
        customized: [],
      });

      setParts(transformedParts);
      setIsPartsClicked(true);
    } catch (error) {
      console.error('Error fetching parts:', error);
      // Handle errors as needed
    }
  };

    return(
        <div>
            <ShippingForm 
            shipping ={shipping}
            handleChange ={handleShippingChange}
            handleGetParts={handleGetParts}
            />
            <PartForm
            handleInputChange={handleInputChange}
            handleRemovePart={handleRemovePart}
            parts={parts} 
            editModes={editModes}
            handleEditCustomizedChange={handleEditCustomizedChange}
            handleEditPart={handleEditPart}
            handleCheckTotal={handleCheckTotal}
            handleRepack={handleRepack}
            />

          <button onClick={handleSubmit} className="submit" disabled={!isPartsClicked}>Submit</button>

          {serverResponse && <p>Server Response: {serverResponse}</p>}
          {/* {progress && <p>Progress: {progress}</p> }
          {message && <p>message: {message}</p>} */}
        </div>
    )
};

export default Dashboard;
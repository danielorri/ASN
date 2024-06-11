import { useState, useEffect } from "react";
import io from "socket.io-client";
import PartForm from "../forms/partsForm";
import ShippingForm from "../forms/shippingForm";
import Repack from "../FunctionHelpers/repackFunction";
import getParts from "../FunctionHelpers/getParts";
import ProgressCenteredModal from "./progressModal";
import LoginComponent from "./LoginComponents/LonginComponent";
import { useNavigate } from 'react-router-dom';

const socket = io("http://10.100.111.10:3010");
let socketId; // Variable to store the socket.id

socket.on("connect", () => {
  socketId = socket.id;
});

const Dashboard = ()=>{
  const [progress, setProgress] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [messages, setMessages] = useState([]);

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
    const [isPartsClicked, setIsPartsClicked] = useState(true);
    const [isDuplicates, setIsDuplicates] = useState(false);

    const handleShippingChange = (e) =>{
        const { name, value }= e.target;
        const generatedPackingSLipID = value.replace(/\//g, ''); 
        if(name === 'ShippingDate'){
          setShipping({ ...shipping, [name]: value, PackingSLipID: generatedPackingSLipID});
        } else{
          setShipping({ ...shipping, [name]: value});
        }
    }

    const navigate = useNavigate();
    useEffect(() => {
      const isAuthenticated = document.cookie.split('; ').find(row => row.startsWith('username='));
      if (!isAuthenticated) {
          navigate('/');  // Redirects to the login page
      }
  }, [navigate]); 

    //Part
    const initialPart = {
        partNo: "",
        quantity: "",
        mixedOrMaster: "Mixed",
        repackedQuantity: "",
        isDuplicate: false,
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
                isDuplicate: false,
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

  useEffect(() => {
    // Set up a listener for the 'progressUpdate' event from the server
    socket.on("progressUpdate", (data) => {
      setProgress(data.progress);
      setServerResponse(data.message);
      setMessages((prevMessages) => [data.message, ...prevMessages]);
      // Handle the progress update as needed
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("progressUpdate");
    };
  }, []);

  const handleElectroluxAspRevise = async () => {
    try {

      const res = handleCheckDuplicate();

      if(res){
        alert("Duplicate parts");
      } else {
      // Prepare the data to send to the server
      const dataToSend = {
        parts,
        shipping,
      };

        // Send a POST request to the server
      const response = await fetch("http://10.100.111.10:3010/resviseASPElectrolux", {
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
      }
      
    } catch (error) {
      // Handle any network or other errors
      console.error("Error:", error);
      setServerResponse("Error: Something went wrong");
    }
  };


  const handleElectroluxAspSubmit = async () => {
    try {

      const res = handleCheckDuplicate();

      if(res){
        alert("Duplicate parts");
      } else {
      // Prepare the data to send to the server
      const dataToSend = {
        parts,
        shipping,
      };

        // Send a POST request to the server
      const response = await fetch("http://10.100.111.10:3010/buildASPElectrolux", {
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
      }

      
    } catch (error) {
      // Handle any network or other errors
      console.error("Error:", error);
      setServerResponse("Error: Something went wrong");
    }
  };

  const handleSubmit = async () => {

    try {
      const res = handleCheckDuplicate();

      if(res){
        alert("Duplicate parts");
      } else if(parts[0].customized.length === 0){
        alert("Repack before submitting.");
      } else {
        setModalShow(true);
     
      const dataToSend = {
        parts,
        shipping,
        cookies: document.cookie,
      };

        const response = await fetch("http://10.100.111.10:3010/buildASN", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "socketId": socketId,
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.status === 200) {
          const responseData = await response.json();
          console.log(responseData);
          setServerResponse(responseData.message.message);
        } else {
          setServerResponse("Error: Failed to submit data to the server");
        }
      }
      
      
    } catch (error) {
      console.error("Error:", error);
      setServerResponse("Error: Something went wrong");
    }
  };
  

  function getFormattedToday() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear().toString();
  
    return `${month}/${day}/${year.slice(2)}`;
  }
  

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
          isDuplicate: false,
          customized: [],
        }));
      });

      // Add an empty object to the transformedParts array
      transformedParts.push({
        partNo: "",
        quantity: "",
        mixedOrMaster: "Mixed",
        repackedQuantity: "",
        isDuplicate: false,
        customized: [],
      });

      setParts(transformedParts);
      setIsPartsClicked(true);
    } catch (error) {
      console.error('Error fetching parts:', error);
      // Handle errors as needed
    }
  };

  const handleCheckDuplicate = () => {
    const partNos = new Set();
    const duplicatePartNos = new Set();
  
    // Iterate through all parts to check for duplicates
    parts.forEach((part) => {
      const { partNo } = part;
  
      if (partNos.has(partNo)) {
        duplicatePartNos.add(partNo);
      } else {
        partNos.add(partNo);
      }
    });
  
    // Update state to mark duplicates
    const updatedParts = parts.map((part) => ({
      ...part,
      isDuplicate: duplicatePartNos.has(part.partNo),
    }));

    if (duplicatePartNos.size > 0) {
      // Duplicates found
      setIsDuplicates(true);
    } else {
      // No duplicates found
      setIsDuplicates(false);
    }
  
    // Update the state with the new information
    setParts(updatedParts);

    if (duplicatePartNos.size > 0) {
      // Duplicates found
      return true;
    }  else {
      return false
    }
  };
  

    return(
        <div>
           <div className="m-4 d-flex flex-row-reverse"><LoginComponent /></div>
            <ShippingForm 
            shipping ={shipping}
            handleChange ={handleShippingChange}
            handleGetParts={handleGetParts}
            
            today={getFormattedToday()}
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
            isDuplicates={isDuplicates}
            />
          {shipping.Customer === '9675' && shipping.ShippingDate !== getFormattedToday() || shipping.Customer === '9676' && shipping.ShippingDate !== getFormattedToday() || shipping.Customer === '10105' && shipping.ShippingDate !== getFormattedToday() || shipping.Customer === '10053' &&
  shipping.ShippingDate !== getFormattedToday() ?<button onClick={handleElectroluxAspSubmit} className="submit" disabled={!isPartsClicked}>Submit ASP Electrolux</button>:shipping.Customer === '9675' || shipping.Customer === '9676' || shipping.Customer === '10105' || shipping.Customer === '10053'?
  <button onClick={handleElectroluxAspRevise} className="submit" disabled={!isPartsClicked}>Revise ASP Electrolux</button>: <button onClick={handleSubmit} className="submit" disabled={!isPartsClicked}>Submit</button>}
          
          
          <div className="m-2">
            {serverResponse && <p>Server Response: {serverResponse}</p>}
          </div>

      <ProgressCenteredModal 
        show={modalShow}
        onHide={() => setModalShow(false)}
        progress={progress}
        serverResponse={serverResponse}
        messages = {messages}
      />
          
          {/* {progress && <p>Progress: {progress}</p> }
          {message && <p>message: {message}</p>} */}
        </div>
    )
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDailyOrders, updateCsvData } from '../../app/features/orders/dailyOrdersAsyncthunk';
import AlwaysOpenAcordeon from './dailyAcordeon';
import LoginComponent from '../LoginComponents/LonginComponent';

const DailyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.dailyOrders.data);
  const status = useSelector((state) => state.dailyOrders.status);
  const error = useSelector((state) => state.dailyOrders.error);

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [groupedOrders, setGroupedOrders] = useState({});
  const [isReadOnly, setIsReadOnly] =useState(true);
  const [soLookup, setSoLookup] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const cookies = document.cookie;
    const cookiesArray =cookies.split("; ");
    const cookiesStored = [];
    for(const cookie of cookiesArray){
        const [cookieName, cookieValue] = cookie.split("=");
        cookiesStored.push(cookieName);
        cookiesStored.push(cookieValue);
    }
    if(cookiesStored.includes("username") && cookiesStored.includes("password") ){
        setIsReadOnly(false);
    }

}, [])

 
    // Update groupedOrders when orders change
    useEffect(() => {
        // Dispatch the fetchDailyOrders action with the selected date
        dispatch(fetchDailyOrders(selectedDate));
      }, [dispatch, selectedDate]);

    useEffect(() => {
        const updatedGroupedOrders = {};
        if (orders) {
          orders.forEach((order) => {
            const key = `${order.CardCode}-${order.ShipToCode}-${order.U_SIF_PO_Sample || 'N'}`;
            if (!updatedGroupedOrders[key]) {
              updatedGroupedOrders[key] = [];
            }
            updatedGroupedOrders[key].push(order);
          });
        }
        setGroupedOrders(updatedGroupedOrders);
      }, [orders]); 


  // Function to get today's date in the format 'YYYY-MM-DD'
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //handle SO# lookup
  const handleSearch = () => {
    let foundItems = null;
    let parentKey = null;
    Object.keys(groupedOrders).forEach(key => {
        groupedOrders[key].forEach(item => {
            if (item.DocNum === soLookup) {
                foundItems = groupedOrders[key]; // Get all items under the parent key
                parentKey = key; // Save the parent key
            }
        });
    });
    if(foundItems){
      setSearchResult({ [parentKey]: foundItems });
    } else {
      setSearchResult("SO# number not found please verify snd try again."); // Maintain the structure
    }
};

const handleClearSearch = () =>{
  setSoLookup('');
  setSearchResult(null)
}


  const handleSoChange = (event) =>{
    setSoLookup(event.target.value)
  }

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCarrierChange = (key, newCarrier) => {
    setGroupedOrders((prevGroupedOrders) => {
      const stringKey = String(key);

      return {
        ...prevGroupedOrders,
        [stringKey]: prevGroupedOrders[stringKey].map((order) => ({
          ...order,
          CARRIER: newCarrier,
        })),
      };
    });
  };

  const handleEditField = (key, index, field, value) => {
    setGroupedOrders((prevGroupedOrders) => {
      // Ensure key is a string
      const stringKey = String(key);
  
      return {
        ...prevGroupedOrders,
        [stringKey]: prevGroupedOrders[stringKey].map((item, i) => {
          // If the current index matches the provided index, update the field
          if (i === index) {
            return {
              ...item,
              [field]: value,
            };
          }
          // Otherwise, leave the item unchanged
          return item;
        }),
      };
    });
  };
  
  const handleUpdateCsv = () => {
    // Ungroup groupedOrders and dispatch update
    const ungroupedOrders = Object.values(groupedOrders).flat();
    dispatch(updateCsvData(ungroupedOrders));
  };
  

  // Render loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Render error state
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }


  return (
    <div>
        <div className='d-flex justify-content-around'>
        <div className="m-4 d-flex flex-row-reverse"><LoginComponent /></div>
            <h1 className='text-center m-3'>Daily Orders</h1>
            
            {/* Date Picker */}
            <div className="text-center mb-3">
            {isReadOnly?
            <div className='d-inline'>
               <label htmlFor="soLookup" className='me-2 fw-bold'>SO#: </label>
            <input
                id="soLookup"
                value={soLookup}
                onChange={handleSoChange}
            />
            <button onClick={handleSearch} className='btn btn-primary ms-2'> Search</button>
            <button onClick={handleClearSearch} className='btn btn-danger ms-2'>Clear</button>
            </div>: <div></div>}
            <button onClick={handleUpdateCsv} className={isReadOnly? "m-5":"btn btn-primary m-5"} disabled={isReadOnly}>Save</button>
            <label htmlFor="datePicker" className='me-2 fw-bold'>Date: </label>
            <input
                type="date"
                id="datePicker"
                value={selectedDate}
                onChange={handleDateChange}
            />
           
            </div>
        </div>
        {searchResult === "SO# number not found please verify snd try again."?<h3 className='m-5'>SO# not found, try another date or please verify and try again.</h3>:searchResult && (
        <div>
        <h3 className='m-5'>Search results:</h3>
        <div>
          {Object.keys(searchResult).map((groupKey) => {
                return (
                    <div key={groupKey} style={{ width: '90%', margin: 'auto' }}>
                        <AlwaysOpenAcordeon gkey={groupKey} handleCarrierChange={handleCarrierChange} onEditField={handleEditField} groupedOrders={searchResult[groupKey]} />
                    </div>
                );
            })}
        </div>
        </div>
      )}


      {searchResult === "SO# number not found please verify snd try again."?<div></div>:!searchResult && groupedOrders && (
        <div>
          {Object.keys(groupedOrders).map((groupKey) => {
                return (
                    <div key={groupKey} style={{ width: '90%', margin: 'auto' }}>
                        <AlwaysOpenAcordeon gkey={groupKey} handleCarrierChange={handleCarrierChange} onEditField={handleEditField} groupedOrders={groupedOrders[groupKey]} />
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default DailyOrders;


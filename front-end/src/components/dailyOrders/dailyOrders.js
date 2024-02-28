import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDailyOrders } from '../../app/features/orders/dailyOrdersAsyncthunk';
import AlwaysOpenAcordeon from './dailyAcordeon';

const DailyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.dailyOrders.data);
  const status = useSelector((state) => state.dailyOrders.status);
  const error = useSelector((state) => state.dailyOrders.error);

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [groupedOrders, setGroupedOrders] = useState({});

 
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
            <h1 className='text-center m-3'>Daily Orders</h1>

            {/* Date Picker */}
            <div className="text-center mb-3">
            <label htmlFor="datePicker" className='me-2 fw-bold'>Date: </label>
            <input
                type="date"
                id="datePicker"
                value={selectedDate}
                onChange={handleDateChange}
            />
            </div>
        </div>

      {groupedOrders && (
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


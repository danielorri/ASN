import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an asynchronous thunk for fetching data
export const fetchDailyOrders = createAsyncThunk(
  'dailyOrders/fetchData',
  async (shipDate, { signal }) => {
    try {
      // Construct the URL with the ShipDate parameter
      const url = `http://localhost:3010/dailyorders?shipDate=${encodeURIComponent(shipDate)}`;

      // Fetch data with an abort signal to handle cancellations
      const response = await fetch(url, { signal });
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
);

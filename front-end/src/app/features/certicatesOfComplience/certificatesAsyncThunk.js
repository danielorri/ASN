import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an asynchronous thunk for fetching data
export const fetchCertificates = createAsyncThunk(
  'dailyOrders/fetchData',
  async (orderNum, { signal }) => {
    try {
      // Construct the URL with the OrderNum parameter
      const url = `http://10.100.111.10:3010/certificateofcompliance?orderNum=${encodeURIComponent(orderNum)}`;

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

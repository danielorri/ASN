import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an asynchronous thunk for fetching data
export const fetchDailyOrders = createAsyncThunk(
  'dailyOrders/fetchData',
  async (shipDate, { signal }) => {
    try {
      // Construct the URL with the ShipDate parameter
      const url = `http://10.100.111.10:3010/dailyorders?shipDate=${encodeURIComponent(shipDate)}`;

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

// Create an asyncThunk for updating the CSV with an array of objects
export const updateCsvData = createAsyncThunk(
  'csv/updateData',
  async (dataArray, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://10.100.111.10:3010/dailyorders/insert-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArray),
      });
      // Check if the status code indicates a successful request
      if (!response.ok) {
        // If the response status code is not successful, use rejectWithValue
        // This allows us to pass the error response object to the action's payload when it is rejected
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Unknown API error');
      }

      // Assuming your API returns the updated list of data in the response body
      const updatedData = await response.json();
      return updatedData; // This will be used as the `payload` in the `fulfilled` action
    } catch (error) {
      // If an error occurs, pass it to the `rejected` action as the `payload`
      return rejectWithValue(error.message);
    }
  }
);
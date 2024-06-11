import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an asynchronous thunk for fetching data
export const fetchInventory = createAsyncThunk(
  'inventory/fetchData',
  async () => { // Removed signal
    try {
      const url = `http://10.100.111.10:3010/inventory`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
);

export const fetchInventoryConsolidation = createAsyncThunk(
    'inventoryConsolidation/fetchData',
    async () => { // Removed signal
      try {
        const url = `http://10.100.111.10:3010/inventory/consolidation`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
  );

  export const fetchInventoryLocked = createAsyncThunk(
    'inventoryLocked/fetchData',
    async () => { // Removed signal
      try {
        const url = `http://10.100.111.10:3010/inventory/locked`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
  );
  
  

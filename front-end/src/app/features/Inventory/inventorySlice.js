import { createSlice } from '@reduxjs/toolkit';
import { fetchInventory, fetchInventoryConsolidation, fetchInventoryLocked } from './inventoryAsyncThunk';

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
      inventory: null,
      consolidation: null,
      lockedInventory: null,
      inventoryStatus: 'idle',
      consolidationStatus: 'idle',
      lockedInventoryStatus: 'idle',
      error: null,
    },
    reducers: {
      // Add other reducers if needed
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchInventory.pending, (state) => {
          state.inventoryStatus = 'loading';
        })
        .addCase(fetchInventory.fulfilled, (state, action) => {
          state.inventoryStatus = 'succeeded';
          state.inventory = action.payload;
        })
        .addCase(fetchInventory.rejected, (state, action) => {
          state.inventoryStatus = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchInventoryConsolidation.pending, (state) => {
          state.consolidationStatus = 'loading';
        })
        .addCase(fetchInventoryConsolidation.fulfilled, (state, action) => {
          state.consolidationStatus = 'succeeded';
          state.consolidation = action.payload;
        })
        .addCase(fetchInventoryConsolidation.rejected, (state, action) => {
          state.consolidationStatus = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchInventoryLocked.pending, (state) => {
          state.lockedInventoryStatus = 'loading';
        })
        .addCase(fetchInventoryLocked.fulfilled, (state, action) => {
          state.lockedInventoryStatus = 'succeeded';
          state.lockedInventory = action.payload;
        })
        .addCase(fetchInventoryLocked.rejected, (state, action) => {
          state.lockedInventoryStatus = 'failed';
          state.error = action.error.message;
        })
    },
  });
  

export default inventorySlice.reducer;
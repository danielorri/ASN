import { createSlice } from '@reduxjs/toolkit';
import { fetchDailyOrders, updateCsvData } from './dailyOrdersAsyncthunk';

const dailyOrdersSlice = createSlice({
  name: 'dailyOrders',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add other reducers if needed
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDailyOrders.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchDailyOrders.fulfilled, (state, action) => {
      
      state.status = 'succeeded';
      state.data = action.payload;
    });
    builder.addCase(fetchDailyOrders.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(updateCsvData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(updateCsvData.fulfilled, (state, action) => {
      
      state.status = 'succeeded';
      state.data = action.payload;
    });
    builder.addCase(updateCsvData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default dailyOrdersSlice.reducer;

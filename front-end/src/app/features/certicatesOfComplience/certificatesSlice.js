import { createSlice } from '@reduxjs/toolkit';
import { fetchCertificates } from './certificatesAsyncThunk';

// Create a slice for the dailyOrders state
const certificatesSlice = createSlice({
  name: 'dailyOrders',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default certificatesSlice.reducer;

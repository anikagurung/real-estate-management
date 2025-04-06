import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch bookings
export const fetchUserBookings = createAsyncThunk('booking/fetchUserBookings', async (userId) => {
  const response = await axios.get(`/bookings/${userId}`);
  return response.data.bookings; // Assuming backend returns { bookings: [...] }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: { bookings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;

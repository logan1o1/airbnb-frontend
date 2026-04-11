import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingsAPI } from "../services/api";
import type { Booking, BookingWithPayment } from "../types";

interface BookingsState {
  bookings: Booking[];
  currentBooking: BookingWithPayment | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getAll();
      return response.data.data as Booking[];
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchBookingById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getById(id);
      return response.data.data as Booking;
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (
    data: {
      booked_listing: string;
      from: string;
      to: string;
      idempotency_key?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookingsAPI.create(data);
      return response.data.data as BookingWithPayment;
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        // Store as booking type (simplified for now)
        state.bookings = state.bookings.map((b) =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload.booking);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentsAPI } from "../services/api";
import type { PaymentResponse, CreatePaymentResponse } from "../types";

interface PaymentsState {
  currentPayment: PaymentResponse | null;
  loading: boolean;
  error: string | null;
  paymentSuccess: boolean;
}

const initialState: PaymentsState = {
  currentPayment: null,
  loading: false,
  error: null,
  paymentSuccess: false,
};

interface CreatePaymentResult {
  payment: PaymentResponse;
}

export const createPayment = createAsyncThunk<
  CreatePaymentResult,
  { bookingId: string; phone: string },
  { rejectValue: string }
>(
  "payments/createPayment",
  async ({ bookingId, phone }, { rejectWithValue }) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await paymentsAPI.create({
        booking_id: bookingId,
        idempotency_key: idempotencyKey,
        phone: phone,
      });
      const paymentData = response.data as CreatePaymentResponse;
      return {
        payment: paymentData.data,
      };
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create payment"
      );
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.currentPayment = null;
      state.loading = false;
      state.error = null;
      state.paymentSuccess = false;
    },
    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.payment;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState, setPaymentSuccess } = paymentsSlice.actions;
export default paymentsSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import listingsReducer from "./slices/listingsSlice";
import bookingsReducer from "./slices/bookingsSlice";
import paymentsReducer from "./slices/paymentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingsReducer,
    bookings: bookingsReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

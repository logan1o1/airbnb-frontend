import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  fetchBookingById,
  createBooking,
  clearError,
  clearCurrentBooking,
} from "../slices/bookingsSlice";
import type { AppDispatch, RootState } from "../store";

export const useBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, currentBooking, loading, error } = useSelector(
    (state: RootState) => state.bookings
  );

  const getBookings = useCallback(() => {
    return dispatch(fetchBookings());
  }, [dispatch]);

  const getBookingById = useCallback(
    (id: string) => {
      return dispatch(fetchBookingById(id));
    },
    [dispatch]
  );

  const createNewBooking = useCallback(
    (data: {
      booked_listing: string;
      from: string;
      to: string;
      idempotency_key?: string;
    }) => {
      return dispatch(createBooking(data));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearCurrent = useCallback(() => {
    dispatch(clearCurrentBooking());
  }, [dispatch]);

  return {
    bookings,
    currentBooking,
    loading,
    error,
    getBookings,
    getBookingById,
    createNewBooking,
    clearError: handleClearError,
    clearCurrentBooking: handleClearCurrent,
  };
};

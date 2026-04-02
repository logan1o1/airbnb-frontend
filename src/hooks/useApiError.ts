import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useApiError = () => {
  const authError = useSelector((state: RootState) => state.auth.error);
  const listingsError = useSelector((state: RootState) => state.listings.error);
  const bookingsError = useSelector((state: RootState) => state.bookings.error);

  const getErrorMessage = useCallback(() => {
    return authError || listingsError || bookingsError || null;
  }, [authError, listingsError, bookingsError]);

  const hasError = !!getErrorMessage();

  return {
    error: getErrorMessage(),
    hasError,
    authError,
    listingsError,
    bookingsError,
  };
};

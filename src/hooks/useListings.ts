import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListings,
  fetchListingById,
  createListing,
  clearError,
  clearSelectedListing,
} from "../slices/listingsSlice";
import type { AppDispatch, RootState } from "../store";

export const useListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, selectedListing, loading, error } = useSelector(
    (state: RootState) => state.listings
  );

  const getListings = useCallback(() => {
    return dispatch(fetchListings());
  }, [dispatch]);

  const getListingById = useCallback(
    (id: string) => {
      return dispatch(fetchListingById(id));
    },
    [dispatch]
  );

  const addListing = useCallback(
    (data: {
      name: string;
      location: string;
      price: number;
      pictures?: string[];
    }) => {
      return dispatch(createListing(data));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelected = useCallback(() => {
    dispatch(clearSelectedListing());
  }, [dispatch]);

  return {
    listings,
    selectedListing,
    loading,
    error,
    getListings,
    getListingById,
    addListing,
    clearError: handleClearError,
    clearSelectedListing: handleClearSelected,
  };
};

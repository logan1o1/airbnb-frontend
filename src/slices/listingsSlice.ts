import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listingsAPI } from "../services/api";
import type { Listing } from "../types";

interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  selectedListing: null,
  loading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listingsAPI.getAll();
      return response.data as Listing[];
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch listings"
      );
    }
  }
);

export const fetchListingById = createAsyncThunk(
  "listings/fetchListingById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await listingsAPI.getById(id);
      return response.data as Listing;
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch listing"
      );
    }
  }
);

export const createListing = createAsyncThunk(
  "listings/createListing",
  async (
    data: { name: string; location: string; price: number; pictures?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await listingsAPI.create(data);
      return response.data as Listing;
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create listing"
      );
    }
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedListing } = listingsSlice.actions;
export default listingsSlice.reducer;

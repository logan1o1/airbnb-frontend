import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";
import type { User, AuthResponse } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("authToken") || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data as AuthResponse;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(apiError.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(apiError.response?.data?.message || "Logout failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: {
      username: string;
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.signup(data);
      const { user, token } = response.data as AuthResponse;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(apiError.response?.data?.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

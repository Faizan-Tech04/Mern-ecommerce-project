import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// ==========================================
// Register User
// ==========================================

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Register Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Registration failed",
        },
      );
    }
  },
);

// ==========================================
// Login User
// ==========================================

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Login Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Login failed",
        },
      );
    }
  },
);

// ==========================================
// Logout User
// ==========================================

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Logout Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Logout failed",
        },
      );
    }
  },
);

// ==========================================
// Check Authentication
// ==========================================

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
          withCredentials: true,

          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",

            Pragma: "no-cache",

            Expires: "0",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Check Auth Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Authentication failed",
        },
      );
    }
  },
);

// ==========================================
// Auth Slice
// ==========================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // Register
    // ======================================

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // ======================================
    // Login
    // ======================================

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })

      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // ======================================
    // Logout
    // ======================================

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // ======================================
    // Check Auth
    // ======================================

    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })

      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// ==========================================
// Actions
// ==========================================

export const { setUser } = authSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default authSlice.reducer;

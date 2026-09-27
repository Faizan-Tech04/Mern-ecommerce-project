import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null,
};

// ==========================================
// Search Products
// ==========================================

export const searchProducts = createAsyncThunk(
  "search/searchProducts",

  async (keyword, { rejectWithValue }) => {
    try {
      const trimmedKeyword = keyword?.trim();

      // ==========================================
      // Validate Keyword
      // ==========================================

      if (!trimmedKeyword) {
        return rejectWithValue("Search keyword is required");
      }

      // ==========================================
      // Get Authentication Token
      // ==========================================

      const token = localStorage.getItem("token");

      // ==========================================
      // API Request
      // ==========================================

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/search/${encodeURIComponent(
          trimmedKeyword,
        )}`,
        {
          withCredentials: true,

          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Search API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to search products",
      );
    }
  },
);

// ==========================================
// Search Slice
// ==========================================

const searchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // Pending
      // ==========================================

      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // ==========================================
      // Success
      // ==========================================

      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.searchResults = action.payload?.data || [];
      })

      // ==========================================
      // Failed
      // ==========================================

      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;

        state.searchResults = [];

        state.error = action.payload || "Failed to search products";
      });
  },
});

// ==========================================
// Actions
// ==========================================

export const { clearSearchResults } = searchSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default searchSlice.reducer;

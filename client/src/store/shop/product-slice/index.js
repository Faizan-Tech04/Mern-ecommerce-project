import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// ==========================================
// Fetch All Filtered Products
// ==========================================

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllFilteredProducts",
  async (
    { filterParams = {}, sortParams = "price-lowtohigh" },
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams();

      // ==========================================
      // Add Filter Parameters
      // ==========================================

      for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.set(key, value.join(","));
        }
      }

      // ==========================================
      // Add Sort Parameter
      // ==========================================

      queryParams.set("sortBy", sortParams);

      // ==========================================
      // API Request
      // ==========================================

      const result = await axios.get(
        `http://localhost:5000/api/shop/products/get?${queryParams.toString()}`,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch products",
        },
      );
    }
  },
);

// ==========================================
// Fetch Product Details
// ==========================================

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      // ==========================================
      // API Request
      // ==========================================

      const result = await axios.get(
        `http://localhost:5000/api/shop/products/get/${id}`,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch product details",
        },
      );
    }
  },
);

// ==========================================
// Shopping Products Slice
// ==========================================

const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH PRODUCTS - PENDING
      // ==========================================

      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })

      // ==========================================
      // FETCH PRODUCTS - FULFILLED
      // ==========================================

      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.productList = action.payload.data;
        }
      })

      // ==========================================
      // FETCH PRODUCTS - REJECTED
      // ==========================================

      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // ==========================================
      // FETCH PRODUCT DETAILS - PENDING
      // ==========================================

      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.productDetails = null;
      })

      // ==========================================
      // FETCH PRODUCT DETAILS - FULFILLED
      // ==========================================

      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.productDetails = action.payload.data;
        }
      })

      // ==========================================
      // FETCH PRODUCT DETAILS - REJECTED
      // ==========================================

      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export default shoppingProductsSlice.reducer;

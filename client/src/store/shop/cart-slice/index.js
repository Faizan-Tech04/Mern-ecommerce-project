import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  cartItems: [],
  isLoading: false,
};

// ==========================================
// Helper - Get Auth Header
// ==========================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    withCredentials: true,

    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
};

// ==========================================
// Add To Cart
// ==========================================

export const addToCart = createAsyncThunk(
  "cart/addToCart",

  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
        {
          productId,
          quantity,
        },
        getAuthConfig(),
      );

      return response.data;
    } catch (error) {
      console.error("Add To Cart Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to add product to cart",
        },
      );
    }
  },
);

// ==========================================
// Fetch Cart Items
// ==========================================

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/get`,
        getAuthConfig(),
      );

      return response.data;
    } catch (error) {
      console.error("Fetch Cart Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch cart items",
        },
      );
    }
  },
);

// ==========================================
// Update Cart Item Quantity
// ==========================================

export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",

  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
        {
          productId,
          quantity,
        },
        getAuthConfig(),
      );

      return response.data;
    } catch (error) {
      console.error("Update Cart Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update cart quantity",
        },
      );
    }
  },
);

// ==========================================
// Delete Cart Item
// ==========================================

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",

  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/delete/${productId}`,
        getAuthConfig(),
      );

      return response.data;
    } catch (error) {
      console.error("Delete Cart Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete cart item",
        },
      );
    }
  },
);

// ==========================================
// Shopping Cart Slice
// ==========================================

const shoppingCartSlice = createSlice({
  name: "shoppingCart",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================================
      // Add To Cart
      // ==========================================

      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.cartItems = action.payload.data?.items || [];
        }
      })

      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })

      // ==========================================
      // Fetch Cart Items
      // ==========================================

      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.cartItems = action.payload.data?.items || [];
        }
      })

      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      // ==========================================
      // Update Cart Quantity
      // ==========================================

      .addCase(updateCartItemQty.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.cartItems = action.payload.data?.items || [];
        }
      })

      .addCase(updateCartItemQty.rejected, (state) => {
        state.isLoading = false;
      })

      // ==========================================
      // Delete Cart Item
      // ==========================================

      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.cartItems = action.payload.data?.items || [];
        }
      })

      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// ==========================================
// Export Reducer
// ==========================================

export default shoppingCartSlice.reducer;

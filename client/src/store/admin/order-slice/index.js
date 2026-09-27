import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

// ==========================================
// Get All Orders
// ==========================================

export const getAllOrders = createAsyncThunk(
  "adminOrder/getAllOrders",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/orders/list",
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get All Admin Orders Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch orders",
        },
      );
    }
  },
);

// ==========================================
// Get Order Details
// ==========================================

export const getOrderDetails = createAsyncThunk(
  "adminOrder/getOrderDetails",

  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/orders/details/${orderId}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get Admin Order Details Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch order details",
        },
      );
    }
  },
);

// ==========================================
// Update Order Status
// ==========================================

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",

  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/orders/update/${orderId}`,

        {
          orderStatus,
        },

        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Update Admin Order Status Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update order status",
        },
      );
    }
  },
);

// ==========================================
// Admin Order Slice
// ==========================================

const adminOrderSlice = createSlice({
  name: "adminOrder",

  initialState,

  reducers: {
    // ==========================================
    // Clear Order List
    // ==========================================

    clearOrderList: (state) => {
      state.orderList = [];
    },

    // ==========================================
    // Clear Order Details
    // ==========================================

    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },

  // ==========================================
  // Extra Reducers
  // ==========================================

  extraReducers: (builder) => {
    // ==========================================
    // Get All Orders
    // ==========================================

    builder

      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.orderList = action.payload.orders || [];
        } else {
          state.orderList = [];
        }
      })

      .addCase(getAllOrders.rejected, (state) => {
        state.isLoading = false;

        state.orderList = [];
      });

    // ==========================================
    // Get Order Details
    // ==========================================

    builder

      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;

        state.orderDetails = null;
      })

      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.orderDetails = action.payload.order || null;
        }
      })

      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;

        state.orderDetails = null;
      });

    // ==========================================
    // Update Order Status
    // ==========================================

    builder

      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          const updatedOrder = action.payload.order;

          // ----------------------------------
          // Update Order List
          // ----------------------------------

          if (updatedOrder?._id) {
            state.orderList = state.orderList.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order,
            );
          }

          // ----------------------------------
          // Update Order Details
          // ----------------------------------

          state.orderDetails = updatedOrder || state.orderDetails;
        }
      })

      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// ==========================================
// Export Actions
// ==========================================

export const { clearOrderList, clearOrderDetails } = adminOrderSlice.actions;

// ==========================================
// Export Reducer
// ==========================================

export default adminOrderSlice.reducer;

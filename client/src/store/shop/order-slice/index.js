import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  approvalURL: null,

  isLoading: false,

  order: null,

  orderList: [],

  orderDetails: null,
};

// ==========================================
// CREATE PAYPAL ORDER
// ==========================================

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
        orderData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Create Order Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to create order",
        },
      );
    }
  },
);

// ==========================================
// CAPTURE PAYPAL PAYMENT
// ==========================================

export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
        {
          orderId,
        },
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Capture Payment Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to capture payment",
        },
      );
    }
  },
);

// ==========================================
// GET ALL ORDERS BY USER
// ==========================================

export const getAllOrdersByUser = createAsyncThunk(
  "order/getAllOrdersByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get User Orders Error:", error);

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
// GET SINGLE ORDER DETAILS
// ==========================================

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/details/${orderId}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get Order Details Error:", error);

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
// ORDER SLICE
// ==========================================

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",

  initialState,

  reducers: {
    // ========================================
    // Clear Order State
    // ========================================

    clearOrderState: (state) => {
      state.approvalURL = null;
      state.isLoading = false;
      state.order = null;
      state.orderDetails = null;
    },

    // ========================================
    // Clear Order List
    // ========================================

    clearOrderList: (state) => {
      state.orderList = [];
    },

    // ========================================
    // Clear Order Details
    // ========================================

    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================
    // CREATE ORDER
    // ========================================

    builder

      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.approvalURL = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.approvalURL = action.payload.approvalURL || null;

          state.order = {
            orderId: action.payload.orderId || null,

            paypalOrderId: action.payload.paypalOrderId || null,

            originalAmount: action.payload.originalAmount || null,

            paypalAmount: action.payload.paypalAmount || null,
          };
        }
      })

      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
      });

    // ========================================
    // CAPTURE PAYMENT
    // ========================================

    builder

      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.order = {
            ...state.order,

            orderId: action.payload.orderId || state.order?.orderId || null,

            paypalOrderId:
              action.payload.paypalOrderId ||
              state.order?.paypalOrderId ||
              null,

            paymentId: action.payload.paymentId || "",

            payerId: action.payload.payerId || "",

            paymentStatus: action.payload.paymentStatus || "paid",

            orderStatus: action.payload.orderStatus || "inProcess",
          };

          state.approvalURL = null;
        }
      })

      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;
      });

    // ========================================
    // GET ALL USER ORDERS
    // ========================================

    builder

      .addCase(getAllOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.orderList = action.payload.orders || [];
        } else {
          state.orderList = [];
        }
      })

      .addCase(getAllOrdersByUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      });

    // ========================================
    // GET SINGLE ORDER DETAILS
    // ========================================

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
  },
});

// ==========================================
// Actions
// ==========================================

export const { clearOrderState, clearOrderList, clearOrderDetails } =
  shoppingOrderSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default shoppingOrderSlice.reducer;

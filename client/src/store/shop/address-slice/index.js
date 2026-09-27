import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isLoading: false,
  addressList: [],
};

// ==========================================
// Add Address
// ==========================================

export const addAddress = createAsyncThunk(
  "address/addAddress",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/address/add",
        formData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Add Address Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to add address",
        },
      );
    }
  },
);

// ==========================================
// Fetch All Addresses
// ==========================================

export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shop/address/get",
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Fetch Address Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch addresses",
        },
      );
    }
  },
);

// ==========================================
// Edit Address
// ==========================================

export const editAddress = createAsyncThunk(
  "address/editAddress",

  async ({ addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/shop/address/edit/${addressId}`,
        formData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Edit Address Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to edit address",
        },
      );
    }
  },
);

// ==========================================
// Delete Address
// ==========================================

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",

  async (addressId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/shop/address/delete/${addressId}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Delete Address Error:", error);

      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete address",
        },
      );
    }
  },
);

// ==========================================
// Address Slice
// ==========================================

const addressSlice = createSlice({
  name: "address",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // ======================================
    // Add Address
    // ======================================

    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success && action.payload?.data) {
          state.addressList.unshift(action.payload.data);
        }
      })

      .addCase(addAddress.rejected, (state) => {
        state.isLoading = false;
      });

    // ======================================
    // Fetch Addresses
    // ======================================

    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.addressList = action.payload.data || [];
        }
      })

      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;

        state.addressList = [];
      });

    // ======================================
    // Edit Address
    // ======================================

    builder
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success && action.payload?.data) {
          const updatedAddress = action.payload.data;

          const index = state.addressList.findIndex(
            (address) => address._id === updatedAddress._id,
          );

          if (index !== -1) {
            state.addressList[index] = updatedAddress;
          }
        }
      })

      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
      });

    // ======================================
    // Delete Address
    // ======================================

    builder
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          const deletedAddressId = action.meta.arg;

          state.addressList = state.addressList.filter(
            (address) => address._id !== deletedAddressId,
          );
        }
      })

      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// ==========================================
// Export Reducer
// ==========================================

export default addressSlice.reducer;

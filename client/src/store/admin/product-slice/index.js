import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// ==========================================
// Add New Product
// ==========================================

export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/admin/products/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to add product",
        },
      );
    }
  },
);

// ==========================================
// Fetch All Products
// ==========================================

export const fetchAllProduct = createAsyncThunk(
  "products/fetchAllProduct",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        "http://localhost:5000/api/admin/products/get",
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
// Edit Product
// ==========================================

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to edit product",
        },
      );
    }
  },
);

// ==========================================
// Delete Product
// ==========================================

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/api/admin/products/delete/${id}`,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete product",
        },
      );
    }
  },
);

// ==========================================
// Admin Products Slice
// ==========================================

const AdminProductsSlice = createSlice({
  name: "adminProducts",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ======================================
      // ADD PRODUCT
      // ======================================

      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.productList.push(action.payload.product);
        }
      })

      .addCase(addNewProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // ======================================
      // FETCH ALL PRODUCTS
      // ======================================

      .addCase(fetchAllProduct.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          state.productList = action.payload.products;
        }
      })

      .addCase(fetchAllProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // ======================================
      // EDIT PRODUCT
      // ======================================

      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          const updatedProduct = action.payload.product;

          const index = state.productList.findIndex(
            (product) => product._id === updatedProduct._id,
          );

          if (index !== -1) {
            state.productList[index] = updatedProduct;
          }
        }
      })

      .addCase(editProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // ======================================
      // DELETE PRODUCT
      // ======================================

      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success) {
          const deletedProductId = action.meta.arg;

          state.productList = state.productList.filter(
            (product) => product._id !== deletedProductId,
          );
        }
      })

      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default AdminProductsSlice.reducer;

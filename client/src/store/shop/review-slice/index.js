import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isLoading: false,
  isSubmitting: false,

  reviews: [],
  totalReviews: 0,
  averageRating: 0,

  error: null,
};

// ==========================================
// Get Product Reviews
// ==========================================

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue("Product ID is required");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get Reviews API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product reviews",
      );
    }
  },
);

// ==========================================
// Add Product Review
// ==========================================

export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue("Product ID is required");
      }

      if (!rating) {
        return rejectWithValue("Rating is required");
      }

      if (!comment?.trim()) {
        return rejectWithValue("Review comment is required");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
        {
          productId,
          rating,
          comment: comment.trim(),
        },
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Add Review API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review",
      );
    }
  },
);

// ==========================================
// Review Slice
// ==========================================

const reviewSlice = createSlice({
  name: "review",

  initialState,

  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.totalReviews = 0;
      state.averageRating = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // Get Reviews - Pending
      // ======================================

      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // ======================================
      // Get Reviews - Success
      // ======================================

      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.reviews = action.payload?.data || [];

        state.totalReviews = action.payload?.totalReviews || 0;

        state.averageRating = action.payload?.averageRating || 0;
      })

      // ======================================
      // Get Reviews - Failed
      // ======================================

      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;

        state.reviews = [];
        state.totalReviews = 0;
        state.averageRating = 0;

        state.error = action.payload || "Failed to fetch product reviews";
      })

      // ======================================
      // Add Review - Pending
      // ======================================

      .addCase(addReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })

      // ======================================
      // Add Review - Success
      // ======================================

      .addCase(addReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.error = null;

        const newReview = action.payload?.data;

        if (newReview) {
          state.reviews.unshift(newReview);
        }

        // Recalculate review count
        state.totalReviews = state.reviews.length;

        // Recalculate average rating
        if (state.reviews.length > 0) {
          const totalRating = state.reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0,
          );

          state.averageRating = Number(
            (totalRating / state.reviews.length).toFixed(1),
          );
        } else {
          state.averageRating = 0;
        }
      })

      // ======================================
      // Add Review - Failed
      // ======================================

      .addCase(addReview.rejected, (state, action) => {
        state.isSubmitting = false;

        state.error = action.payload || "Failed to submit review";
      });
  },
});

// ==========================================
// Actions
// ==========================================

export const { clearReviews } = reviewSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default reviewSlice.reducer;

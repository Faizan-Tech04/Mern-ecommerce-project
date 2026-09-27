import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// ==========================================
// Initial State
// ==========================================

const initialState = {
  isLoading: false,
  isSubmitting: false,

  featureList: [],

  error: null,
};

// ==========================================
// Get All Features
// ==========================================

export const getFeatures = createAsyncThunk(
  "feature/getFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/common/feature/get",
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Get Features API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch features",
      );
    }
  },
);

// ==========================================
// Add New Feature
// ==========================================

export const addFeature = createAsyncThunk(
  "feature/addFeature",
  async (
    { image, title, description, isActive = true },
    { rejectWithValue },
  ) => {
    try {
      if (!image?.trim()) {
        return rejectWithValue("Feature image is required");
      }

      if (!title?.trim()) {
        return rejectWithValue("Feature title is required");
      }

      if (!description?.trim()) {
        return rejectWithValue("Feature description is required");
      }

      const response = await axios.post(
        "http://localhost:5000/api/common/feature/add",
        {
          image: image.trim(),
          title: title.trim(),
          description: description.trim(),
          isActive,
        },
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Add Feature API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to add feature",
      );
    }
  },
);

// ==========================================
// Update Feature
// ==========================================

export const updateFeature = createAsyncThunk(
  "feature/updateFeature",
  async ({ id, image, title, description, isActive }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Feature ID is required");
      }

      const response = await axios.put(
        `http://localhost:5000/api/common/feature/update/${id}`,
        {
          image,
          title,
          description,
          isActive,
        },
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Update Feature API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to update feature",
      );
    }
  },
);

// ==========================================
// Delete Feature
// ==========================================

export const deleteFeature = createAsyncThunk(
  "feature/deleteFeature",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Feature ID is required");
      }

      const response = await axios.delete(
        `http://localhost:5000/api/common/feature/delete/${id}`,
        {
          withCredentials: true,
        },
      );

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      console.error("Delete Feature API Error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete feature",
      );
    }
  },
);

// ==========================================
// Feature Slice
// ==========================================

const featureSlice = createSlice({
  name: "feature",

  initialState,

  reducers: {
    clearFeatureError: (state) => {
      state.error = null;
    },

    clearFeatureList: (state) => {
      state.featureList = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // Get Features
      // ======================================

      .addCase(getFeatures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.featureList = action.payload?.data || [];
      })

      .addCase(getFeatures.rejected, (state, action) => {
        state.isLoading = false;

        state.featureList = [];

        state.error = action.payload || "Failed to fetch features";
      })

      // ======================================
      // Add Feature
      // ======================================

      .addCase(addFeature.pending, (state) => {
        state.isSubmitting = true;

        state.error = null;
      })

      .addCase(addFeature.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.error = null;

        const newFeature = action.payload?.data;

        if (newFeature) {
          state.featureList.unshift(newFeature);
        }
      })

      .addCase(addFeature.rejected, (state, action) => {
        state.isSubmitting = false;

        state.error = action.payload || "Failed to add feature";
      })

      // ======================================
      // Update Feature
      // ======================================

      .addCase(updateFeature.pending, (state) => {
        state.isSubmitting = true;

        state.error = null;
      })

      .addCase(updateFeature.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.error = null;

        const updatedFeature = action.payload?.data;

        if (updatedFeature) {
          const index = state.featureList.findIndex(
            (feature) => feature._id === updatedFeature._id,
          );

          if (index !== -1) {
            state.featureList[index] = updatedFeature;
          }
        }
      })

      .addCase(updateFeature.rejected, (state, action) => {
        state.isSubmitting = false;

        state.error = action.payload || "Failed to update feature";
      })

      // ======================================
      // Delete Feature
      // ======================================

      .addCase(deleteFeature.pending, (state) => {
        state.isSubmitting = true;

        state.error = null;
      })

      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.error = null;

        const deletedId = action.payload?.id;

        state.featureList = state.featureList.filter(
          (feature) => feature._id !== deletedId,
        );
      })

      .addCase(deleteFeature.rejected, (state, action) => {
        state.isSubmitting = false;

        state.error = action.payload || "Failed to delete feature";
      });
  },
});

// ==========================================
// Actions
// ==========================================

export const { clearFeatureError, clearFeatureList } = featureSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default featureSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";

// ==========================================
// Auth
// ==========================================

import authReducer from "./auth-slice";

// ==========================================
// Admin
// ==========================================

import adminProductsSlice from "./admin/product-slice";
import adminOrderReducer from "./admin/order-slice";
import featureReducer from "./admin/feature-slice";

// ==========================================
// Shop
// ==========================================

import shopProductsSlice from "./shop/product-slice";
import shopCartSlice from "./shop/cart-slice";
import addressReducer from "./shop/address-slice";
import orderReducer from "./shop/order-slice";
import searchReducer from "./shop/search-slice";
import reviewReducer from "./shop/review-slice";

// ==========================================
// Redux Store
// ==========================================

const store = configureStore({
  reducer: {
    // ==========================================
    // Authentication
    // ==========================================

    auth: authReducer,

    // ==========================================
    // Admin
    // ==========================================

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderReducer,
    adminFeatures: featureReducer,

    // ==========================================
    // Shop
    // ==========================================

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    address: addressReducer,
    order: orderReducer,
    search: searchReducer,
    review: reviewReducer,
  },
});

// ==========================================
// Export Store
// ==========================================

export default store;

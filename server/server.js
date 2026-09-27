require("dotenv").config({ override: true });

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ==========================================
// Routes
// ==========================================

const authRouter = require("./routes/auth-route.js");

// ==========================================
// Admin Routes
// ==========================================

const adminProductsRouter = require("./routes/admin/products-routes.js");
const adminOrderRouter = require("./routes/admin/order-routes.js");

// ==========================================
// Common Routes
// ==========================================

const commonFeatureRouter = require("./routes/common/feature-routes.js");

// ==========================================
// Shop Routes
// ==========================================

const shopProductRouter = require("./routes/shop/products-routes.js");
const shopCartRouter = require("./routes/shop/cart-routes.js");
const shopAddressRouter = require("./routes/shop/address-routes.js");
const shopOrderRouter = require("./routes/shop/order-routes.js");
const shopSearchRouter = require("./routes/shop/search-routes.js");
const shopReviewRouter = require("./routes/shop/review-routes.js");

// ==========================================
// App Configuration
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],

    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

// ==========================================
// API Routes
// ==========================================

// ==========================================
// Authentication
// ==========================================

app.use("/api/auth", authRouter);

// ==========================================
// Admin Routes
// ==========================================

// Admin Products
app.use("/api/admin/products", adminProductsRouter);

// Admin Orders
app.use("/api/admin/orders", adminOrderRouter);

// ==========================================
// Common Routes
// ==========================================

// Features
app.use("/api/common/feature", commonFeatureRouter);

// ==========================================
// Shop Routes
// ==========================================

// Shop Products
app.use("/api/shop/products", shopProductRouter);

// Shop Cart
app.use("/api/shop/cart", shopCartRouter);

// Shop Address
app.use("/api/shop/address", shopAddressRouter);

// Shop Orders / PayPal
app.use("/api/shop/order", shopOrderRouter);

// Shop Search
app.use("/api/shop/search", shopSearchRouter);

// Shop Reviews
app.use("/api/shop/review", shopReviewRouter);

// ==========================================
// MongoDB Connection
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

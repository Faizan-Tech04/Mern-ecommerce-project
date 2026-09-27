const express = require("express");

const {
  addReview,
  getReviews,
} = require("../../controllers/shop/review-controller.js");

const { authMiddleware } = require("../../controllers/auth-controller.js");

const router = express.Router();

// ==========================================
// Get Product Reviews
// ==========================================

router.get("/:productId", getReviews);

// ==========================================
// Add Product Review
// ==========================================

router.post("/add", authMiddleware, addReview);

// ==========================================
// Export Router
// ==========================================

module.exports = router;

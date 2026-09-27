const mongoose = require("mongoose");

// ==========================================
// Product Review Schema
// ==========================================

const ProductReviewSchema = new mongoose.Schema(
  {
    // ==========================================
    // Product
    // ==========================================

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ==========================================
    // User
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // User Name
    // ==========================================

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // Rating
    // ==========================================

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ==========================================
    // Review Comment
    // ==========================================

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Prevent Duplicate Review
// ==========================================

ProductReviewSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model("ProductReview", ProductReviewSchema);

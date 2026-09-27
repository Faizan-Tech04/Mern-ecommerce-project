const mongoose = require("mongoose");

// ==========================================
// Feature Schema
// ==========================================

const FeatureSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model("Feature", FeatureSchema);

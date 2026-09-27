const express = require("express");

// ==========================================
// Feature Controller
// ==========================================

const {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} = require("../../controllers/admin/feature-controller.js");

// ==========================================
// Authentication
// ==========================================

const { authMiddleware } = require("../../controllers/auth-controller.js");

// ==========================================
// Router
// ==========================================

const router = express.Router();

// ==========================================
// Get All Features
// ==========================================

router.get("/get", getFeatures);

// ==========================================
// Add Feature
// ==========================================

router.post("/add", authMiddleware, addFeature);

// ==========================================
// Update Feature
// ==========================================

router.put("/update/:id", authMiddleware, updateFeature);

// ==========================================
// Delete Feature
// ==========================================

router.delete("/delete/:id", authMiddleware, deleteFeature);

// ==========================================
// Export Router
// ==========================================

module.exports = router;

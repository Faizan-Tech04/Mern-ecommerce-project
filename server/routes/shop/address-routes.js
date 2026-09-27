const express = require("express");

const {
  addAddress,
  fetchAllAddresses,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller.js");

const { authMiddleware } = require("../../controllers/auth-controller.js");

const router = express.Router();

// ==========================================
// Add Address
// ==========================================

router.post("/add", authMiddleware, addAddress);

// ==========================================
// Fetch All Addresses
// ==========================================

router.get("/get", authMiddleware, fetchAllAddresses);

// ==========================================
// Edit Address
// ==========================================

router.put("/edit/:addressId", authMiddleware, editAddress);

// ==========================================
// Delete Address
// ==========================================

router.delete("/delete/:addressId", authMiddleware, deleteAddress);

module.exports = router;

const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller.js");

const router = express.Router();

// ==========================================
// Get Filtered Products
// ==========================================

router.get("/get", getFilteredProducts);

// ==========================================
// Get Product Details
// ==========================================

router.get("/get/:id", getProductDetails);

module.exports = router;

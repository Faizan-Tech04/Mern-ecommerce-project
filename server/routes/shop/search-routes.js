const express = require("express");

const {
  searchProducts,
} = require("../../controllers/shop/search-controller.js");

const router = express.Router();

// ==========================================
// Search Products
// ==========================================

router.get("/:keyword", searchProducts);

module.exports = router;

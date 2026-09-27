const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller.js");

const { authMiddleware } = require("../../controllers/auth-controller.js");

const router = express.Router();

// ==========================================
// Add To Cart
// ==========================================

router.post("/add", authMiddleware, addToCart);

// ==========================================
// Fetch Cart Items
// ==========================================

router.get("/get", authMiddleware, fetchCartItems);

// ==========================================
// Update Cart Item Quantity
// ==========================================

router.put("/update-cart", authMiddleware, updateCartItemQty);

// ==========================================
// Delete Cart Item
// ==========================================

router.delete("/delete/:productId", authMiddleware, deleteCartItem);

module.exports = router;

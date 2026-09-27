const express = require("express");

const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller.js");

const { authMiddleware } = require("../../controllers/auth-controller.js");

const router = express.Router();

// ==========================================
// CREATE PAYPAL ORDER
// ==========================================

router.post("/create", authMiddleware, createOrder);

// ==========================================
// CAPTURE PAYPAL PAYMENT
// ==========================================

router.post("/capture", authMiddleware, capturePayment);

// ==========================================
// GET ALL ORDERS OF USER
// ==========================================

router.get("/list/:userId", authMiddleware, getAllOrdersByUser);

// ==========================================
// GET SINGLE ORDER DETAILS
// ==========================================

router.get("/details/:id", authMiddleware, getOrderDetails);

module.exports = router;

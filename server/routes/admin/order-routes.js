const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetails,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller.js");

const { authMiddleware } = require("../../controllers/auth-controller.js");

const router = express.Router();

// ==========================================
// GET ALL ORDERS OF ALL USERS
// ==========================================

router.get("/list", authMiddleware, getAllOrdersOfAllUsers);

// ==========================================
// GET SINGLE ORDER DETAILS
// ==========================================

router.get("/details/:id", authMiddleware, getOrderDetails);

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put("/update/:id", authMiddleware, updateOrderStatus);

module.exports = router;

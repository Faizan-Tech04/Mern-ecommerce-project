const Order = require("../../models/Order.js");

// ==========================================
// Get All Orders Of All Users
// ==========================================

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    // ==========================================
    // Find All Orders
    // ==========================================

    const orders = await Order.find({}).sort({ createdAt: -1 });

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (e) {
    console.error("GET ALL ORDERS ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// Get Single Order Details
// ==========================================

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // Validate Order ID
    // ==========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // ==========================================
    // Find Order
    // ==========================================

    const order = await Order.findById(id);

    // ==========================================
    // Order Not Found
    // ==========================================

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      order,
    });
  } catch (e) {
    console.error("GET ADMIN ORDER DETAILS ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // ==========================================
    // Validate Order ID
    // ==========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // ==========================================
    // Validate Order Status
    // ==========================================

    const allowedStatuses = [
      "pending",
      "inProcess",
      "inShipping",
      "delivered",
      "rejected",
    ];

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ==========================================
    // Find And Update Order
    // ==========================================

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // ==========================================
    // Order Not Found
    // ==========================================

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (e) {
    console.error("UPDATE ORDER STATUS ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetails,
  updateOrderStatus,
};

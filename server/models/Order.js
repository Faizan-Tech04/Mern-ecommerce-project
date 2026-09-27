const mongoose = require("mongoose");

// ==========================================
// Order Schema
// ==========================================

const OrderSchema = new mongoose.Schema(
  {
    // ==========================================
    // User Information
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // Cart Items
    // ==========================================

    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        salePrice: {
          type: Number,
          default: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // ==========================================
    // Shipping Address
    // ==========================================

    addressInfo: {
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      notes: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // Order Status
    // ==========================================

    orderStatus: {
      type: String,

      enum: ["pending", "inProcess", "inShipping", "delivered", "rejected"],

      default: "pending",
    },

    // ==========================================
    // Payment Method
    // ==========================================

    paymentMethod: {
      type: String,

      enum: ["paypal", "cod"],

      default: "paypal",
    },

    // ==========================================
    // Payment Status
    // ==========================================

    paymentStatus: {
      type: String,

      enum: ["pending", "paid", "failed", "refunded"],

      default: "pending",
    },

    // ==========================================
    // Original Website Amount - INR
    // ==========================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // PayPal Amount - USD
    // ==========================================

    paypalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // PayPal Order ID
    // ==========================================

    paypalOrderId: {
      type: String,
      default: "",
    },

    // ==========================================
    // PayPal Payment / Capture ID
    // ==========================================

    paymentId: {
      type: String,
      default: "",
    },

    // ==========================================
    // PayPal Payer ID
    // ==========================================

    payerId: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model("Order", OrderSchema);

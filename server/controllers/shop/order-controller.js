const Order = require("../../models/Order.js");
const Product = require("../../models/Product.js");

const {
  OrdersController,
  CheckoutPaymentIntent,
} = require("@paypal/paypal-server-sdk");

const paypalClient = require("../../helpers/paypal.js");

const ordersController = new OrdersController(paypalClient);

// ==========================================
// INR TO USD CONVERSION
// ==========================================

const convertINRToUSD = (amountInINR) => {
  const exchangeRate = Number(process.env.INR_TO_USD_RATE);

  if (!exchangeRate || exchangeRate <= 0) {
    throw new Error("Invalid INR_TO_USD_RATE in environment variables");
  }

  return Number((Number(amountInINR) * exchangeRate).toFixed(2));
};

// ==========================================
// CREATE PAYPAL ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, totalAmount } = req.body;

    // ==========================================
    // Basic Validation
    // ==========================================

    if (
      !userId ||
      !cartItems?.length ||
      !addressInfo ||
      totalAmount === undefined ||
      Number(totalAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // ==========================================
    // Original Website Amount - INR
    // ==========================================

    const totalAmountINR = Number(totalAmount);

    // ==========================================
    // Convert INR → USD
    // ==========================================

    const totalAmountUSD = convertINRToUSD(totalAmountINR);

    // ==========================================
    // Validate USD Amount
    // ==========================================

    if (totalAmountUSD <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid converted USD amount",
      });
    }

    // ==========================================
    // Console Check
    // ==========================================

    console.log("================================");
    console.log("PAYPAL ORDER AMOUNT");
    console.log("INR:", totalAmountINR);
    console.log("USD:", totalAmountUSD);
    console.log("================================");

    // ==========================================
    // PayPal Return / Cancel URLs
    // ==========================================

    const clientBaseUrl = process.env.CLIENT_BASE_URL?.replace(/\/$/, "");

    if (!clientBaseUrl) {
      return res.status(500).json({
        success: false,
        message: "CLIENT_BASE_URL is not configured",
      });
    }

    const returnUrl = `${clientBaseUrl}/shop/paypal-return`;

    const cancelUrl = `${clientBaseUrl}/shop/paypal-cancel`;

    // ==========================================
    // Create PayPal Order
    // ==========================================

    const { result } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,

        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: totalAmountUSD.toFixed(2),
            },
          },
        ],

        applicationContext: {
          brandName: "Ecommerce",
          locale: "en-IN",
          userAction: "PAY_NOW",
          returnUrl,
          cancelUrl,
        },
      },
    });

    // ==========================================
    // Check PayPal Order
    // ==========================================

    if (!result?.id) {
      return res.status(500).json({
        success: false,
        message: "Failed to create PayPal order",
      });
    }

    // ==========================================
    // Get PayPal Approval URL
    // ==========================================

    const approvalURL = result?.links?.find(
      (link) => link.rel === "approve",
    )?.href;

    if (!approvalURL) {
      return res.status(500).json({
        success: false,
        message: "PayPal approval URL not found",
      });
    }

    // ==========================================
    // Create MongoDB Order
    // ==========================================

    const newlyCreatedOrder = new Order({
      userId,

      cartItems,

      addressInfo,

      orderStatus: "pending",

      paymentMethod: "paypal",

      paymentStatus: "pending",

      totalAmount: totalAmountINR,

      paypalAmount: totalAmountUSD,

      paypalOrderId: result.id,

      paymentId: "",

      payerId: "",
    });

    await newlyCreatedOrder.save();

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,

      message: "PayPal order created successfully",

      approvalURL,

      orderId: newlyCreatedOrder._id,

      paypalOrderId: result.id,

      originalAmount: {
        currency: "INR",
        value: totalAmountINR,
      },

      paypalAmount: {
        currency: "USD",
        value: totalAmountUSD,
      },
    });
  } catch (e) {
    console.error("CREATE PAYPAL ORDER ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// CAPTURE PAYPAL PAYMENT
// ==========================================

const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // ==========================================
    // Validate PayPal Order ID
    // ==========================================

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "PayPal order ID is required",
      });
    }

    // ==========================================
    // Find MongoDB Order
    // ==========================================

    const existingOrder = await Order.findOne({
      paypalOrderId: orderId,
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // Already Paid Check
    // ==========================================

    if (existingOrder.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,

        message: "Payment was already captured",

        orderId: existingOrder._id,

        paypalOrderId: existingOrder.paypalOrderId,

        paymentId: existingOrder.paymentId || "",

        payerId: existingOrder.payerId || "",

        paymentStatus: "paid",

        orderStatus: existingOrder.orderStatus,

        alreadyCaptured: true,
      });
    }

    // ==========================================
    // Capture PayPal Payment
    // ==========================================

    let result;

    try {
      const captureResponse = await ordersController.captureOrder({
        id: orderId,
      });

      result = captureResponse?.result;
    } catch (paypalError) {
      // ========================================
      // Duplicate Capture Handling
      // ========================================

      const paypalErrorName =
        paypalError?.body?.name ||
        paypalError?.result?.name ||
        paypalError?.name;

      if (
        paypalErrorName === "ORDER_ALREADY_CAPTURED" ||
        existingOrder.paymentStatus === "paid"
      ) {
        return res.status(200).json({
          success: true,

          message: "Payment was already captured",

          orderId: existingOrder._id,

          paypalOrderId: existingOrder.paypalOrderId,

          paymentId: existingOrder.paymentId || "",

          payerId: existingOrder.payerId || "",

          paymentStatus: "paid",

          orderStatus: existingOrder.orderStatus,

          alreadyCaptured: true,
        });
      }

      throw paypalError;
    }

    // ==========================================
    // Check Capture Response
    // ==========================================

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Payment capture failed",
      });
    }

    // ==========================================
    // Get Capture Information
    // ==========================================

    const capture = result?.purchaseUnits?.[0]?.payments?.captures?.[0];

    const paymentId = capture?.id || "";

    const payerId = result?.payer?.payerId || "";

    const captureStatus = capture?.status;

    // ==========================================
    // Console Check
    // ==========================================

    console.log("================================");

    console.log("PAYPAL CAPTURE STATUS:", captureStatus);

    console.log("PAYPAL ORDER ID:", orderId);

    console.log("PAYMENT ID:", paymentId);

    console.log("PAYER ID:", payerId);

    console.log("================================");

    // ==========================================
    // Payment Successful
    // ==========================================

    if (captureStatus === "COMPLETED") {
      // ========================================
      // CHECK PRODUCT STOCK FIRST
      // ========================================

      for (const item of existingOrder.cartItems) {
        const product = await Product.findById(item.productId);

        // ======================================
        // Product Not Found
        // ======================================

        if (!product) {
          return res.status(404).json({
            success: false,

            message: `Product not found: ${item.title || "Unknown Product"}`,
          });
        }

        // ======================================
        // Check Available Stock
        // ======================================

        if (Number(product.totalStock) < Number(item.quantity)) {
          return res.status(400).json({
            success: false,

            message: `Not enough stock for ${product.title}`,
          });
        }
      }

      // ========================================
      // REDUCE PRODUCT STOCK
      // ========================================

      for (const item of existingOrder.cartItems) {
        const product = await Product.findById(item.productId);

        product.totalStock = Number(product.totalStock) - Number(item.quantity);

        await product.save();

        console.log(`Stock updated: ${product.title}`);

        console.log(`Remaining stock: ${product.totalStock}`);
      }

      // ========================================
      // UPDATE ORDER PAYMENT STATUS
      // ========================================

      existingOrder.paymentStatus = "paid";

      existingOrder.orderStatus = "inProcess";

      existingOrder.paymentId = paymentId;

      existingOrder.payerId = payerId;

      await existingOrder.save();

      // ========================================
      // Success Response
      // ========================================

      return res.status(200).json({
        success: true,

        message: "Payment captured successfully",

        orderId: existingOrder._id,

        paypalOrderId: orderId,

        paymentId,

        payerId,

        paymentStatus: "paid",

        orderStatus: "inProcess",

        data: result,
      });
    }

    // ==========================================
    // Payment Not Completed
    // ==========================================

    existingOrder.paymentStatus = "failed";

    await existingOrder.save();

    return res.status(400).json({
      success: false,

      message: "PayPal payment was not completed",

      paymentStatus: captureStatus || "UNKNOWN",

      paypalOrderId: orderId,
    });
  } catch (e) {
    console.error("CAPTURE PAYPAL PAYMENT ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// GET ALL ORDERS BY USER
// ==========================================

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // ========================================
    // Validate User ID
    // ========================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ========================================
    // Find User Orders
    // ========================================

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    // ========================================
    // Response
    // ========================================

    return res.status(200).json({
      success: true,

      message: "Orders fetched successfully",

      orders,
    });
  } catch (e) {
    console.error("GET USER ORDERS ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// GET SINGLE ORDER DETAILS
// ==========================================

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // ========================================
    // Validate Order ID
    // ========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // ========================================
    // Find Order
    // ========================================

    const order = await Order.findById(id);

    // ========================================
    // Order Not Found
    // ========================================

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ========================================
    // Response
    // ========================================

    return res.status(200).json({
      success: true,

      message: "Order details fetched successfully",

      order,
    });
  } catch (e) {
    console.error("GET ORDER DETAILS ERROR:", e.message);

    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};

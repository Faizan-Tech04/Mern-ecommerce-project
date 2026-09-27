const Product = require("../../models/Product.js");
const Cart = require("../../models/Cart.js");

// ==========================================
// Add To Cart
// ==========================================

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user.id;

    // ==========================================
    // Validate Data
    // ==========================================

    const requestedQuantity = Number(quantity);

    if (
      !productId ||
      !Number.isFinite(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // ==========================================
    // Find Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // Get Available Stock
    // ==========================================

    const availableStock = Number(product.totalStock || 0);

    // ==========================================
    // Check Product Stock
    // ==========================================

    if (availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // ==========================================
    // Check Requested Quantity
    // ==========================================

    if (requestedQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock`,
      });
    }

    // ==========================================
    // Find Existing Cart
    // ==========================================

    let cart = await Cart.findOne({
      userId,
    });

    // ==========================================
    // Create Cart If Not Exists
    // ==========================================

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // ==========================================
    // Check Existing Product In Cart
    // ==========================================

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    // ==========================================
    // Product Not In Cart
    // ==========================================

    if (findCurrentProductIndex === -1) {
      cart.items.push({
        productId: product._id,

        image: product.image,

        title: product.title,

        price: product.price,

        salePrice: product.salePrice,

        quantity: requestedQuantity,
      });
    } else {
      // ========================================
      // Product Already In Cart
      // ========================================

      const currentQuantity = Number(
        cart.items[findCurrentProductIndex].quantity || 0,
      );

      const newQuantity = currentQuantity + requestedQuantity;

      // ========================================
      // Check Total Quantity Against Stock
      // ========================================

      if (newQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} items available in stock`,
        });
      }

      // ========================================
      // Update Quantity
      // ========================================

      cart.items[findCurrentProductIndex].quantity = newQuantity;

      // ========================================
      // Update Latest Product Details
      // ========================================

      cart.items[findCurrentProductIndex].image = product.image;

      cart.items[findCurrentProductIndex].title = product.title;

      cart.items[findCurrentProductIndex].price = product.price;

      cart.items[findCurrentProductIndex].salePrice = product.salePrice;
    }

    // ==========================================
    // Save Cart
    // ==========================================

    await cart.save();

    // ==========================================
    // Return Cart
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Product added to cart successfully",

      data: cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error occurred while adding product to cart",
    });
  }
};

// ==========================================
// Fetch Cart Items
// ==========================================

const fetchCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // ==========================================
    // Find Cart
    // ==========================================

    const cart = await Cart.findOne({
      userId,
    });

    // ==========================================
    // Cart Doesn't Exist
    // ==========================================

    if (!cart) {
      return res.status(200).json({
        success: true,

        data: {
          items: [],
        },
      });
    }

    // ==========================================
    // Remove Invalid Product References
    // ==========================================

    const validItems = cart.items.filter((item) => item.productId);

    // ==========================================
    // Update Cart If Invalid Items Found
    // ==========================================

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;

      await cart.save();
    }

    // ==========================================
    // Return Cart
    // ==========================================

    return res.status(200).json({
      success: true,

      data: {
        ...cart._doc,
        items: validItems,
      },
    });
  } catch (error) {
    console.error("FETCH CART ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching cart",
    });
  }
};

// ==========================================
// Update Cart Item Quantity
// ==========================================

const updateCartItemQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user.id;

    // ==========================================
    // Validate Quantity
    // ==========================================

    const requestedQuantity = Number(quantity);

    if (
      !productId ||
      !Number.isFinite(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // ==========================================
    // Find Cart
    // ==========================================

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ==========================================
    // Find Product In Cart
    // ==========================================

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // ==========================================
    // Find Latest Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // Get Available Stock
    // ==========================================

    const availableStock = Number(product.totalStock || 0);

    // ==========================================
    // Check Stock
    // ==========================================

    if (availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if (requestedQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock`,
      });
    }

    // ==========================================
    // Update Quantity
    // ==========================================

    cart.items[findCurrentProductIndex].quantity = requestedQuantity;

    // ==========================================
    // Update Latest Product Details
    // ==========================================

    cart.items[findCurrentProductIndex].image = product.image;

    cart.items[findCurrentProductIndex].title = product.title;

    cart.items[findCurrentProductIndex].price = product.price;

    cart.items[findCurrentProductIndex].salePrice = product.salePrice;

    // ==========================================
    // Save Cart
    // ==========================================

    await cart.save();

    // ==========================================
    // Return Updated Cart
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Cart quantity updated successfully",

      data: cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error occurred while updating cart",
    });
  }
};

// ==========================================
// Delete Cart Item
// ==========================================

const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id;

    // ==========================================
    // Validate Data
    // ==========================================

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // ==========================================
    // Find Cart
    // ==========================================

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ==========================================
    // Find Product In Cart
    // ==========================================

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // ==========================================
    // Remove Product
    // ==========================================

    cart.items.splice(findCurrentProductIndex, 1);

    // ==========================================
    // Save Cart
    // ==========================================

    await cart.save();

    // ==========================================
    // Return Updated Cart
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Product removed from cart successfully",

      data: cart,
    });
  } catch (error) {
    console.error("DELETE CART ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting cart item",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};

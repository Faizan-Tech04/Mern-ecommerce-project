const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

// ==========================================
// Add Product Review
// ==========================================

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // ==========================================
    // Validate Product ID
    // ==========================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // ==========================================
    // Validate Rating
    // ==========================================

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    // ==========================================
    // Validate Comment
    // ==========================================

    const trimmedComment = comment?.trim();

    if (!trimmedComment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required",
      });
    }

    if (trimmedComment.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Review must contain at least 2 characters",
      });
    }

    if (trimmedComment.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Review cannot exceed 500 characters",
      });
    }

    // ==========================================
    // Get Logged In User
    // ==========================================

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ==========================================
    // Check Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // Check Existing Review
    // ==========================================

    const existingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // ==========================================
    // Create Review
    // ==========================================

    const newReview = await ProductReview.create({
      productId,
      userId,
      userName: req.user?.userName || "User",
      rating: numericRating,
      comment: trimmedComment,
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    // ==========================================
    // Duplicate Index Error
    // ==========================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error while adding product review",
    });
  }
};

// ==========================================
// Get Product Reviews
// ==========================================

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // ==========================================
    // Validate Product ID
    // ==========================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // ==========================================
    // Check Product
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // Fetch Reviews
    // ==========================================

    const reviews = await ProductReview.find({
      productId,
    }).sort({
      createdAt: -1,
    });

    // ==========================================
    // Calculate Average Rating
    // ==========================================

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      data: reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching product reviews",
    });
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  addReview,
  getReviews,
};

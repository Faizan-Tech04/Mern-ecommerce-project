const Product = require("../../models/Product");

// ==========================================
// Search Products
// ==========================================

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    // ==========================================
    // Validate Keyword
    // ==========================================

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    // ==========================================
    // Escape Regex Characters
    // ==========================================

    const escapedKeyword = keyword
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedKeyword, "i");

    // ==========================================
    // Search Products
    // ==========================================

    const products = await Product.find({
      $or: [
        {
          title: {
            $regex: searchRegex,
          },
        },
        {
          description: {
            $regex: searchRegex,
          },
        },
        {
          category: {
            $regex: searchRegex,
          },
        },
        {
          brand: {
            $regex: searchRegex,
          },
        },
      ],
    }).sort({
      createdAt: -1,
    });

    // ==========================================
    // Response
    // ==========================================

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Search Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Error while searching products",
    });
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  searchProducts,
};

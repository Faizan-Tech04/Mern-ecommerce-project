const Product = require("../../models/Product.js");

// ==========================================
// Get Filtered Products
// ==========================================

const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    // ==========================================
    // Category Filter
    // ==========================================

    if (category.length) {
      filters.category = {
        $in: category.split(","),
      };
    }

    // ==========================================
    // Brand Filter
    // ==========================================

    if (brand.length) {
      filters.brand = {
        $in: brand.split(","),
      };
    }

    // ==========================================
    // Sorting
    // ==========================================

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;

      case "price-hightolow":
        sort.price = -1;
        break;

      case "title-atoz":
        sort.title = 1;
        break;

      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
    }

    // ==========================================
    // Get Products
    // ==========================================

    const products = await Product.find(filters).sort(sort);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Fetch Shop Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching products",
    });
  }
};

// ==========================================
// Get Product Details
// ==========================================

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching product details",
    });
  }
};

// ==========================================
// Export Controllers
// ==========================================

module.exports = {
  getFilteredProducts,
  getProductDetails,
};

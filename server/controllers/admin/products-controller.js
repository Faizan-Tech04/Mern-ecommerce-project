const { ImageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product.js");

// ==========================================
// Upload Product Image
// ==========================================

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const url = `data:${req.file.mimetype};base64,${b64}`;

    const result = await ImageUploadUtil(url);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while uploading image",
      error: error.message,
    });
  }
};

// ==========================================
// Add Product
// ==========================================

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price: Number(price),
      salePrice: Number(salePrice || 0),
      totalStock: Number(totalStock),
    });

    await newlyCreatedProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
    });
  }
};

// ==========================================
// Fetch All Products
// ==========================================

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};

// ==========================================
// Edit Product
// ==========================================

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // Update Product Fields
    // ==========================================

    if (image !== undefined) {
      findProduct.image = image;
    }

    if (title !== undefined) {
      findProduct.title = title;
    }

    if (description !== undefined) {
      findProduct.description = description;
    }

    if (category !== undefined) {
      findProduct.category = category;
    }

    if (brand !== undefined) {
      findProduct.brand = brand;
    }

    if (price !== undefined) {
      findProduct.price = Number(price);
    }

    // IMPORTANT:
    // salePrice = 0 is valid
    // so don't use: salePrice || oldSalePrice

    if (salePrice !== undefined) {
      findProduct.salePrice = Number(salePrice);
    }

    if (totalStock !== undefined) {
      findProduct.totalStock = Number(totalStock);
    }

    await findProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: findProduct,
    });
  } catch (error) {
    console.error("Edit Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while editing product",
    });
  }
};

// ==========================================
// Delete Product
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting product",
    });
  }
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};

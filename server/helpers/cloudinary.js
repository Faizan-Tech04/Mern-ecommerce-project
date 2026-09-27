const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// ==========================================
// Cloudinary Configuration
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  secret_exists: Boolean(process.env.CLOUDINARY_API_SECRET),
});

// ==========================================
// Multer Configuration
// ==========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// ==========================================
// Upload Image To Cloudinary
// ==========================================

const ImageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "image",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

module.exports = {
  upload,
  ImageUploadUtil,
};

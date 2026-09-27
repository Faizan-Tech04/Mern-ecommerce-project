const Feature = require("../../models/Feature");

// ==========================================
// Get All Features
// ==========================================

const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error("Get Features Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching features",
    });
  }
};

// ==========================================
// Add New Feature
// ==========================================

const addFeature = async (req, res) => {
  try {
    const { image, title, description, isActive } = req.body;

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!image?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feature image is required",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feature title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feature description is required",
      });
    }

    // ----------------------------------------
    // Create Feature
    // ----------------------------------------

    const feature = await Feature.create({
      image: image.trim(),
      title: title.trim(),
      description: description.trim(),
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Feature added successfully",
      data: feature,
    });
  } catch (error) {
    console.error("Add Feature Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while adding feature",
    });
  }
};

// ==========================================
// Update Feature
// ==========================================

const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const { image, title, description, isActive } = req.body;

    // ----------------------------------------
    // Find Feature
    // ----------------------------------------

    const feature = await Feature.findById(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Feature not found",
      });
    }

    // ----------------------------------------
    // Update Fields
    // ----------------------------------------

    if (image !== undefined) {
      if (!image.trim()) {
        return res.status(400).json({
          success: false,
          message: "Feature image cannot be empty",
        });
      }

      feature.image = image.trim();
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Feature title cannot be empty",
        });
      }

      feature.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Feature description cannot be empty",
        });
      }

      feature.description = description.trim();
    }

    if (typeof isActive === "boolean") {
      feature.isActive = isActive;
    }

    // ----------------------------------------
    // Save Updated Feature
    // ----------------------------------------

    await feature.save();

    return res.status(200).json({
      success: true,
      message: "Feature updated successfully",
      data: feature,
    });
  } catch (error) {
    console.error("Update Feature Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while updating feature",
    });
  }
};

// ==========================================
// Delete Feature
// ==========================================

const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findById(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Feature not found",
      });
    }

    await Feature.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Feature deleted successfully",
    });
  } catch (error) {
    console.error("Delete Feature Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while deleting feature",
    });
  }
};

// ==========================================
// Export Controllers
// ==========================================

module.exports = {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
};

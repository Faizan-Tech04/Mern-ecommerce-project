const Address = require("../../models/Address.js");

// ==========================================
// Maximum Address Limit
// ==========================================

const MAX_ADDRESSES = 3;

// ==========================================
// Add Address
// ==========================================

const addAddress = async (req, res) => {
  try {
    // ----------------------------------------
    // Logged-In User ID
    // ----------------------------------------

    const userId = req.user.id;

    const { address, city, pincode, phone, notes } = req.body;

    // ----------------------------------------
    // Validate Required Fields
    // ----------------------------------------

    if (
      !address?.trim() ||
      !city?.trim() ||
      !pincode?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Address, city, pincode and phone are required",
      });
    }

    // ----------------------------------------
    // Check Maximum 3 Addresses
    // ----------------------------------------

    const existingAddressCount = await Address.countDocuments({
      userId,
    });

    if (existingAddressCount >= MAX_ADDRESSES) {
      return res.status(400).json({
        success: false,
        message: "You can add max 3 addresses",
      });
    }

    // ----------------------------------------
    // Create Address
    // ----------------------------------------

    const newlyCreatedAddress = new Address({
      userId,

      address: address.trim(),

      city: city.trim(),

      pincode: pincode.trim(),

      phone: phone.trim(),

      notes: notes?.trim() || "",
    });

    // ----------------------------------------
    // Save Address
    // ----------------------------------------

    await newlyCreatedAddress.save();

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newlyCreatedAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while adding address",
    });
  }
};

// ==========================================
// Fetch All Addresses
// ==========================================

const fetchAllAddresses = async (req, res) => {
  try {
    // ----------------------------------------
    // Logged-In User ID
    // ----------------------------------------

    const userId = req.user.id;

    // ----------------------------------------
    // Fetch User's Addresses
    // ----------------------------------------

    const addresses = await Address.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Fetch Addresses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching addresses",
    });
  }
};

// ==========================================
// Edit Address
// ==========================================

const editAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const userId = req.user.id;

    const { address, city, pincode, phone, notes } = req.body;

    // ----------------------------------------
    // Find Address Of Logged-In User
    // ----------------------------------------

    const findAddress = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!findAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // ----------------------------------------
    // Update Address
    // ----------------------------------------

    if (address !== undefined) {
      findAddress.address = address.trim();
    }

    if (city !== undefined) {
      findAddress.city = city.trim();
    }

    if (pincode !== undefined) {
      findAddress.pincode = pincode.trim();
    }

    if (phone !== undefined) {
      findAddress.phone = phone.trim();
    }

    if (notes !== undefined) {
      findAddress.notes = notes.trim();
    }

    // ----------------------------------------
    // Validate Updated Required Fields
    // ----------------------------------------

    if (
      !findAddress.address ||
      !findAddress.city ||
      !findAddress.pincode ||
      !findAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Address, city, pincode and phone are required",
      });
    }

    // ----------------------------------------
    // Save Updated Address
    // ----------------------------------------

    await findAddress.save();

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: findAddress,
    });
  } catch (error) {
    console.error("Edit Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while editing address",
    });
  }
};

// ==========================================
// Delete Address
// ==========================================

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const userId = req.user.id;

    // ----------------------------------------
    // Delete Only Logged-In User's Address
    // ----------------------------------------

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting address",
    });
  }
};

// ==========================================
// Export
// ==========================================

module.exports = {
  addAddress,
  fetchAllAddresses,
  editAddress,
  deleteAddress,
};

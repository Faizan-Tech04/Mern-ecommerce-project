const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER =================

const registerUser = async (req, res) => {
  console.log("REQUEST BODY:", req.body);

  const { userName, email, password } = req.body;

  try {
    // Check required fields
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    // Save user
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (e) {
    console.log("REGISTER ERROR:", e);

    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exists! Please register first",
      });
    }

    // Check password
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password,
    );

    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "60m",
      },
    );

    // Store token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: checkUser._id,
          userName: checkUser.userName,
          email: checkUser.email,
          role: checkUser.role,
        },
      });
  } catch (e) {
    console.log("LOGIN ERROR:", e);

    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// ================= LOGOUT =================

const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

// ================= AUTH MIDDLEWARE =================

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user information in request
    req.user = decoded;

    // Continue to next middleware/controller
    next();
  } catch (e) {
    console.log("AUTH MIDDLEWARE ERROR:", e);

    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  authMiddleware,
};

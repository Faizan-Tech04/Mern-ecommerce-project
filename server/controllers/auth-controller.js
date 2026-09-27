const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= COOKIE OPTIONS =================

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 1000, // 60 minutes
};

// ================= REGISTER =================

const registerUser = async (req, res) => {
  console.log("REQUEST BODY:", req.body);

  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

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

    // Create JWT
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
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",

        // Also send token to frontend
        token,

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
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
    /*
      First try Authorization header:

      Authorization: Bearer <token>

      If it doesn't exist, fallback to cookie.
    */

    let token = null;

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user information
    req.user = decoded;

    // Continue
    next();
  } catch (e) {
    console.log("AUTH MIDDLEWARE ERROR:", e.message);

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

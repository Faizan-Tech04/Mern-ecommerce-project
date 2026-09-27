const express = require("express");

const {
  registerUser,
  loginUser,
  logout,
  authMiddleware,
} = require("../controllers/auth-controller.js");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user: req.user,
  });
});

module.exports = router;

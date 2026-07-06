const express = require("express");

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/update", authMiddleware, updateProfile);

module.exports = router;
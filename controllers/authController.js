const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, bio, skills } = req.body;

    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
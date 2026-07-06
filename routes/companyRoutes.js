const express = require("express");

const {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new company
router.post("/register", authMiddleware, registerCompany);

// Get all companies
router.get("/", authMiddleware, getCompanies);

// Get company by ID
router.get("/:id", authMiddleware, getCompanyById);

// Update company
router.put("/:id", authMiddleware, updateCompany);

module.exports = router;
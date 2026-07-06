const Company = require("../models/companyModel");

// Register Company
const registerCompany = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can register companies",
      });
    }

    const { companyName, email, location,description } = req.body;

    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      companyName: companyName.trim(),
      location: location || "",
      email:email || "",
      description:description || "",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Companies of Logged-in Recruiter
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Company By ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Company
const updateCompany = async (req, res) => {
  try {
    const {
      companyName,
      location,
      email,
      description,
    } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (companyName !== undefined)
      company.companyName = companyName.trim();

    if (location !== undefined)
      company.location = location;

    if (email !== undefined)
      company.email = email;

    if (description !== undefined)
      company.description = description;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company Updated Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};
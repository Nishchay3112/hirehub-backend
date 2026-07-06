const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");

// Recruiter Posts a Job
const postJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can post jobs",
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      company,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company");

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only the recruiter who created the job can delete it
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Recruiter's Jobs
const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    const jobIds = jobs.map(job => job._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds }
    });

    res.json({
      success: true,
      jobs,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const editJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      company,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (salary) job.salary = salary;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experience) job.experience = experience;
    if (position) job.position = position;
    if (company) job.company = company;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  deleteJob,
  editJob
};
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");

// Student applies for a job
const applyJob = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs",
      });
    }

    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      student: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const { resumeLink } = req.body;

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      resumeLink
    });

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in student's applications
const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    }).populate({
      path: "job",
      populate: {
        path: "company",
      },
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recruiter views applicants for a job
const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

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

    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("student");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recruiter updates application status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application Status Updated",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
};
const express = require("express");

const {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/job/:jobId", authMiddleware, getApplicants);

// Student
router.post("/apply/:jobId", authMiddleware, applyJob);
router.get("/student", authMiddleware, getAppliedJobs);

// Recruiter
router.get("/recruiter/:jobId", authMiddleware, getApplicants);
router.put("/status/:applicationId", authMiddleware, updateStatus);

module.exports = router;
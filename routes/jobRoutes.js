const express = require("express");

const {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  deleteJob,
  editJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { search, location } = req.query;

    let query = {};

    // search by title or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    // location filter
    if (location) {
      query.location = location;
    }

    const jobs = await require("../models/jobModel").find(query);

    res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching jobs",
    });
  }
});

// Recruiter posts a new job
router.post("/post", authMiddleware, postJob);

// Get all jobs
router.get("/", getAllJobs);

// Get jobs posted by recruiter
router.get("/admin/jobs", authMiddleware, getAdminJobs);

// delete the job
router.delete("/:id", authMiddleware, deleteJob);

// edit the job details
router.put('/:id',authMiddleware, editJob);

// get single job details
router.get("/:id", authMiddleware, getJobById);



module.exports = router;
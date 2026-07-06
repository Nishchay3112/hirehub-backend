const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    resumeLink:{
      type: String,
      required : true
    }
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
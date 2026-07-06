const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    location: {
      type: String,
    },

    email:{
      type: String,
    },

    description:{
      type: String,
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
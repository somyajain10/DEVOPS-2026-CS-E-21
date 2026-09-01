const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    requiredSkills: {
      type: [String],
      default: []
    },

    eligibilityCgpa: {
      type: Number,
      required: true
    },

    maxBacklogs: {
      type: Number,
      default: 0
    },

    package: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    applicationDeadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);
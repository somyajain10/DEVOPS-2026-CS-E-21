const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true
    },

    branch: {
      type: String,
      required: true
    },

    section: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },

    graduationYear: {
      type: Number,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    resume: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentId: {
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
      required: true
    },

    backlogs: {
      type: Number,
      default: 0
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

module.exports = mongoose.model("Student", studentSchema);
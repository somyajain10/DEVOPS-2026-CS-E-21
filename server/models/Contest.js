const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    duration: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);

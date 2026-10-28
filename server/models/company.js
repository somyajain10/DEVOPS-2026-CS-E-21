const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    website: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      required: true
    },

    industry: {
      type: String,
      required: true
    },

    contactPerson: {
      type: String,
      required: true
    },

    contactEmail: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

companySchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);

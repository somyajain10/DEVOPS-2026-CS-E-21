
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Company = require("../models/Company");
const Job = require("../models/job");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Fetch logged-in company's profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const profile = await Company.findOne({ user: req.user.id });

      return res.json({
        success: true,
        profile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Create or update logged-in company's profile
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const {
        companyName,
        website,
        industry,
        location,
        description,
        contactPerson,
        contactEmail
      } = req.body;

      if (
        typeof companyName !== "string" || !companyName.trim() ||
        typeof industry !== "string" || !industry.trim() ||
        typeof location !== "string" || !location.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Company name, industry and location are required"
        });
      }

      const profile = await Company.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            companyName,
            website: website || "",
            industry,
            location,
            description: description || "",
            contactPerson: contactPerson || req.user.name || "Company Contact",
            contactEmail: contactEmail || req.user.email
          },
          $setOnInsert: {
            user: req.user.id
          }
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      return res.json({
        success: true,
        message: "Company profile saved successfully",
        profile
      });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Please provide valid company profile details"
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A company profile already exists for this account"
        });
      }

      console.error("Company profile save error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to save company profile"
      });
    }
  }
);

// List placement opportunities owned by the authenticated company.
router.get(
  "/drives",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(409).json({ success: false, message: "Complete your company profile first" });
      }

      const drives = await Job.find({ company: company._id }).sort({ createdAt: -1 });
      return res.json({ success: true, drives });
    } catch (error) {
      console.error("Company drives fetch error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to load placement drives" });
    }
  }
);

// Create a placement opportunity using the existing Job model.
router.post(
  "/drives",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(409).json({ success: false, message: "Complete your company profile first" });
      }

      const {
        jobTitle,
        description,
        requiredSkills = [],
        eligibilityCgpa,
        maxBacklogs = 0,
        package: salaryPackage,
        location,
        applicationDeadline,
        status = "open"
      } = req.body;
      const deadline = new Date(applicationDeadline);
      const cgpa = Number(eligibilityCgpa);
      const backlogs = Number(maxBacklogs);

      if (
        typeof jobTitle !== "string" || !jobTitle.trim() ||
        typeof description !== "string" || !description.trim() ||
        typeof salaryPackage !== "string" || !salaryPackage.trim() ||
        typeof location !== "string" || !location.trim() ||
        !Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10 ||
        !Number.isInteger(backlogs) || backlogs < 0 ||
        !Array.isArray(requiredSkills) || requiredSkills.some((skill) => typeof skill !== "string") ||
        Number.isNaN(deadline.getTime()) || deadline.getTime() <= Date.now() ||
        !["open", "closed"].includes(status)
      ) {
        return res.status(400).json({ success: false, message: "Please provide valid placement opportunity details" });
      }

      const drive = await Job.create({
        company: company._id,
        jobTitle: jobTitle.trim(),
        description: description.trim(),
        requiredSkills: requiredSkills.map((skill) => skill.trim()).filter(Boolean),
        eligibilityCgpa: cgpa,
        maxBacklogs: backlogs,
        package: salaryPackage.trim(),
        location: location.trim(),
        applicationDeadline: deadline,
        status
      });

      return res.status(201).json({ success: true, drive });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ success: false, message: "Please provide valid placement opportunity details" });
      }
      console.error("Company drive create error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to create placement drive" });
    }
  }
);

// Applications are scoped through the authenticated company's own Job records.
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(409).json({ success: false, message: "Complete your company profile first" });
      }

      const jobIds = await Job.find({ company: company._id }).distinct("_id");
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate({
          path: "student",
          select: "userId rollNumber branch cgpa backlogs skills",
          populate: { path: "userId", select: "name email" }
        })
        .populate("job", "jobTitle location package applicationDeadline")
        .sort({ appliedAt: -1 });

      return res.json({ success: true, applications });
    } catch (error) {
      console.error("Company applications fetch error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to load applications" });
    }
  }
);

router.patch(
  "/applications/:applicationId",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      if (!mongoose.isValidObjectId(applicationId)) {
        return res.status(400).json({ success: false, message: "A valid application is required" });
      }
      if (!["applied", "shortlisted", "rejected", "selected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Please provide a valid application status" });
      }

      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(409).json({ success: false, message: "Complete your company profile first" });
      }
      const jobIds = await Job.find({ company: company._id }).distinct("_id");
      const application = await Application.findOneAndUpdate(
        { _id: applicationId, job: { $in: jobIds } },
        { $set: { status } },
        { new: true, runValidators: true }
      )
        .populate({
          path: "student",
          select: "userId rollNumber branch cgpa backlogs skills",
          populate: { path: "userId", select: "name email" }
        })
        .populate("job", "jobTitle location package applicationDeadline");

      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found for this company" });
      }
      return res.json({ success: true, application });
    } catch (error) {
      console.error("Company application update error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to update application status" });
    }
  }
);

// List eligible profiles for one of the authenticated company's drives.
router.get(
  "/eligible-students",
  authMiddleware,
  roleMiddleware("company"),
  async (req, res) => {
    try {
      const { jobId } = req.query;
      if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({ success: false, message: "Select a valid placement drive" });
      }

      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(409).json({ success: false, message: "Complete your company profile first" });
      }
      const drive = await Job.findOne({ _id: jobId, company: company._id });
      if (!drive) {
        return res.status(404).json({ success: false, message: "Placement drive not found for this company" });
      }

      const profiles = await StudentProfile.find({
        cgpa: { $gte: drive.eligibilityCgpa },
        backlogs: { $lte: drive.maxBacklogs }
      })
        .select("userId rollNumber branch cgpa backlogs skills graduationYear")
        .populate("userId", "name email")
        .sort({ cgpa: -1 });
      const requiredSkills = (drive.requiredSkills || []).map((skill) => skill.trim().toLowerCase());
      const eligibleStudents = profiles.filter((profile) => {
        const studentSkills = (profile.skills || []).map((skill) => skill.trim().toLowerCase());
        return requiredSkills.every((skill) => studentSkills.includes(skill));
      });

      return res.json({ success: true, eligibleStudents });
    } catch (error) {
      console.error("Company eligible students error:", error.message);
      return res.status(500).json({ success: false, message: "Unable to load eligible students" });
    }
  }
);

module.exports = router;

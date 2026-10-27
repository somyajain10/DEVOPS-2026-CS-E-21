
const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Fetch logged-in company's profile
router.get(
  "/",
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
  "/",
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

      if (!companyName || !industry || !location) {
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
          runValidators: true
        }
      );

      return res.json({
        success: true,
        message: "Company profile saved successfully",
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

module.exports = router;

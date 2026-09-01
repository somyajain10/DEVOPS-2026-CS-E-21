const express = require("express");

const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

// POST: Submit feedback
router.post("/", createFeedback);

// GET: Get all feedback
router.get("/", getAllFeedback);

module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const Contest = require("../models/Contest");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/admin", authMiddleware, roleMiddleware("admin"), async (_req, res) => {
  try {
    const contests = await Contest.find().sort({ date: 1, createdAt: -1 });
    return res.json({ success: true, contests });
  } catch (error) {
    console.error("Admin contests fetch error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load contests" });
  }
});

router.post("/admin", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { title, company, date, duration } = req.body;
    const validText = (value) => typeof value === "string" && value.trim().length > 0;
    if (!validText(title) || !validText(company) || !validText(duration) ||
        typeof date !== "string" || Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: "Title, company, valid date and duration are required" });
    }

    const contest = await Contest.create({ title, company, date, duration });
    return res.status(201).json({ success: true, contest });
  } catch (error) {
    console.error("Admin contest create error:", error.message);
    return res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.name === "ValidationError" ? "Please provide valid contest details" : "Unable to create contest"
    });
  }
});

router.delete("/admin/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid contest id" });
  }
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: "Contest not found" });
    return res.json({ success: true });
  } catch (error) {
    console.error("Admin contest delete error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to delete contest" });
  }
});

router.get("/student", authMiddleware, roleMiddleware("student"), async (_req, res) => {
  try {
    const contests = await Contest.find().sort({ date: 1 });
    return res.json({ success: true, contests });
  } catch (error) {
    console.error("Student contests fetch error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load contests" });
  }
});

module.exports = router;

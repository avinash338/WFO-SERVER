// backend/routes/attendance.js
const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();

// Helper: basic payload validation
function validatePayload({ userId, userEmail, date, status }) {
  const errors = [];
  if (!userId) errors.push("userId is required");
  if (!userEmail) errors.push("userEmail is required");
  if (!date) errors.push("date is required (prefer ISO yyyy-mm-dd)");
  if (!status) errors.push("status is required");
  if (status && !["WFO", "WFH"].includes(status)) errors.push("status must be 'WFO' or 'WFH'");
  return errors;
}

// POST /api/attendance/submit
router.post("/submit", async (req, res, next) => {
  try {
    const { userId, userEmail, date, status } = req.body;
    const validation = validatePayload({ userId, userEmail, date, status });
    if (validation.length) return res.status(400).json({ errors: validation });
    const attendance = new Attendance({ userId, userEmail, date, status });
    await attendance.save();
    res.status(201).json({ message: "Attendance saved!", id: attendance._id });
  } catch (err) {
    next(err);
  }
});

// GET all attendance
router.get("/", async (req, res, next) => {
  try {
    const { userId, month } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (month) filter.date = { $regex: `^${month}` };
    const records = await Attendance.find(filter).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/:userId/:month
router.get("/:userId/:month", async (req, res, next) => {
  try {
    const { userId, month } = req.params;
    const records = await Attendance.find({
      userId,
      date: { $regex: `^${month}` }
    }).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

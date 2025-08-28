// backend/models/Attendance.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["WFO", "WFH"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);

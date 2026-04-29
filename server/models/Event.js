const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  attendees: { type: Number, default: 0 },
  maxAttendees: { type: Number, required: true },
  description: { type: String, required: true },
  tags: [String],
  color: { type: String },
  gradient: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);

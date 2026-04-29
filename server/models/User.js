const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  department: String,
  year: String,
  role: { type: String, default: "student" },
  joinedEvents: { type: [String], default: [] },
});



module.exports = mongoose.model("User", userSchema);


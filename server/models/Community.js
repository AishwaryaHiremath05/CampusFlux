const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Number, default: 0 },
  icon: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Community", communitySchema);

const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  events: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);

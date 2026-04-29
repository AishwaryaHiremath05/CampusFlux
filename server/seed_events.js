const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from server directory
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const EventSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: String,
  time: String,
  location: String,
  attendees: { type: Number, default: 0 },
  maxAttendees: Number,
  description: String,
  tags: [String],
  color: String,
  gradient: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

const CSIBER_EVENTS = [
  {
    title: "ICICST - 2026",
    category: "Conference",
    date: "Oct 9, 2026",
    time: "10:00 AM",
    location: "Campus Auditorium, CSIBER",
    maxAttendees: 500,
    description: "International Conference on Innovations in Computer Science and Technology. Exploring AI, Blockchain, and IoT.",
    tags: ["Research", "Innovation", "Tech"],
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    featured: true,
  },
  {
    title: "MAH MBA/MMS CET Guidance",
    category: "Seminar",
    date: "May 9, 2026",
    time: "11:00 AM",
    location: "Seminar Hall 1",
    maxAttendees: 200,
    description: "Special guidance session for students appearing for MAH MBA/MMS CET 2026.",
    tags: ["Career", "MBA", "Entrance"],
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    featured: true,
  },
  {
    title: "HR Analytics Workshop",
    category: "Workshop",
    date: "Jun 15, 2026",
    time: "2:00 PM",
    location: "MBA Lab Complex",
    maxAttendees: 60,
    description: "Hands-on session on using data for human resource management and decision making.",
    tags: ["HR", "Analytics", "Data"],
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    featured: true,
  },
  {
    title: "MCA Entrance Exam 2026",
    category: "Exam",
    date: "May 12, 2026",
    time: "10:30 AM",
    location: "IT Building, CSIBER",
    maxAttendees: 300,
    description: "Entrance examination for MCA and other post-graduate computer application courses.",
    tags: ["Admissions", "MCA", "Education"],
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    featured: false,
  },
  {
    title: "Integrated Global Sustainability",
    category: "Conference",
    date: "Dec 4, 2026",
    time: "9:30 AM",
    location: "Main Auditorium",
    maxAttendees: 400,
    description: "International Conference focused on Integrated Global Sustainability and Environmental Management.",
    tags: ["Sustainability", "Environment", "Global"],
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    featured: false,
  }
];

async function seedEvents() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/campus_flux";
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    
    // Clear existing events to avoid duplicates (optional, but good for this task)
    await Event.deleteMany({});
    console.log("Cleared existing events.");

    await Event.insertMany(CSIBER_EVENTS);
    console.log("Successfully seeded CSIBER events!");
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding events:", err);
    process.exit(1);
  }
}

seedEvents();

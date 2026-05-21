const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("./models/User");
const Event = require("./models/Event");
const Community = require("./models/Community");
const Registration = require("./models/Registration");
const Leaderboard = require("./models/Leaderboard");
const nodemailer = require("nodemailer");

dotenv.config();

// Helper to send registration confirmation email
const sendRegistrationEmail = async (userEmail, userName, eventName, eventDate, eventLocation) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"CampusFlux" <${process.env.EMAIL_USER || "noreply@campusflux.com"}>`,
    to: userEmail,
    subject: `Registration Confirmed: ${eventName} | CampusFlux`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">CampusFlux Event Hub</h2>
        </div>
        <p style="font-size: 16px; color: #334155;">Dear <strong>${userName}</strong>,</p>
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">Congratulations! You have successfully registered for the upcoming campus event. Here are your event details:</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
          <h3 style="margin-top: 0; margin-bottom: 12px; color: #1e293b; font-size: 18px;">${eventName}</h3>
          <p style="margin: 6px 0; color: #475569; font-size: 14px;"><strong>📅 Date:</strong> ${eventDate}</p>
          <p style="margin: 6px 0; color: #475569; font-size: 14px;"><strong>📍 Location:</strong> ${eventLocation}</p>
        </div>
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">Please arrive on time. We look forward to your active participation!</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          This is an automated confirmation email from CampusFlux.
        </p>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Confirmation email sent successfully to ${userEmail}`);
    } else {
      console.log("⚠️ EMAIL_USER or EMAIL_PASS not defined. Printing registration details to console:");
      console.log(`To: ${userEmail}\nSubject: ${mailOptions.subject}\nContent:\\n${mailOptions.html}`);
    }
  } catch (error) {
    console.error("❌ Error sending registration email:", error.message);
  }
};

const app = express();
const PORT = 5000;

// Connect to Database
connectDB().then(async () => {
  // Initialize Admin
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const admin = new User({
      fullName: "System Administrator",
      email: "admin@college.com",
      password: hashedPassword,
      role: "admin"
    });
    await admin.save();
    console.log("👤 Default Admin User Created");
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password, department, year } = req.body;

    if (!fullName || !email || !password || !department || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      department,
      year,
    });

    await newUser.save();
    res.status(201).json({ 
      message: "Registration Successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        department: newUser.department,
        year: newUser.year,
        role: newUser.role,
        joinedEvents: newUser.joinedEvents
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Removed Hardcoded Admin Check to use DB instead

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ 
      message: "Login Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        department: user.department,
        year: user.year,
        role: user.role,
        joinedEvents: user.joinedEvents || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { title, category, date, time, location, maxAttendees, description, tags, color, gradient, featured } = req.body;

    if (!title || !category || !date || !time || !location || !maxAttendees || !description) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newEvent = new Event({
      title,
      category,
      date,
      time,
      location,
      maxAttendees,
      description,
      tags: tags || [],
      color: color || "#3b82f6",
      gradient: gradient || "linear-gradient(135deg, #3b82f6, #6366f1)",
      featured: featured || false,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "student" });
    const eventCount = await Event.countDocuments();
    const communityCount = await Community.countDocuments();
    const registrationCount = await Registration.countDocuments();

    res.status(200).json({
      activeStudents: userCount,
      annualEvents: eventCount,
      dynamicCommunities: communityCount,
      totalRegistrations: registrationCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/users/:userId/join", async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event has already occurred
    const eventDate = new Date(event.date);
    if (!isNaN(eventDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        return res.status(400).json({ message: "This event has already occurred. Registrations are closed." });
      }
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Create registration
    const registration = new Registration({ userId, eventId });
    await registration.save();

    // Update user's joinedEvents (for compatibility if needed)
    if (!user.joinedEvents.includes(eventId)) {
      user.joinedEvents.push(eventId);
      await user.save();
    }

    // Update event attendees count
    event.attendees = (event.attendees || 0) + 1;
    await event.save();

    // Send confirmation email
    sendRegistrationEmail(user.email, user.fullName, event.title, event.date, event.location);

    res.status(200).json({ message: "Joined event successfully", joinedEvents: user.joinedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin endpoints
app.get("/api/admin/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalAttendance = await Registration.countDocuments({ attended: true });
    
    const recentRegistrations = await Registration.find()
      .populate("userId", "fullName email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalAttendance,
      recentRegistrations
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/admin/registrations/:eventId", async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate("userId", "fullName email department year");
    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.patch("/api/admin/attendance", async (req, res) => {
  try {
    const { registrationId, attended } = req.body;
    await Registration.findByIdAndUpdate(registrationId, { attended });
    res.status(200).json({ message: "Attendance updated" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    // Optionally delete related registrations
    await Registration.deleteMany({ eventId: req.params.id });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get attended events for a user
app.get("/api/users/:userId/attended", async (req, res) => {
  try {
    const attendedRegs = await Registration.find({ 
      userId: req.params.userId, 
      attended: true 
    }).populate("eventId");
    
    const attendedEvents = attendedRegs.map(reg => reg.eventId).filter(ev => ev !== null);
    res.status(200).json(attendedEvents);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// User Profile Updates
app.put("/api/users/:userId", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        joinedEvents: updatedUser.joinedEvents
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ===== Leaderboard Endpoints =====

// Public: Get all leaderboard entries sorted by rank
app.get("/api/leaderboard", async (req, res) => {
  try {
    const entries = await Leaderboard.find().sort({ rank: 1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Add a leaderboard entry
app.post("/api/admin/leaderboard", async (req, res) => {
  try {
    const { name, avatar, events, wins, points } = req.body;
    if (!name || points === undefined) {
      return res.status(400).json({ message: "Name and points are required" });
    }

    // Auto-assign rank based on current count
    const count = await Leaderboard.countDocuments();
    const entry = new Leaderboard({
      rank: count + 1,
      name,
      avatar: avatar || name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      events: events || 0,
      wins: wins || 0,
      points
    });
    await entry.save();

    // Re-rank all entries by points descending
    const all = await Leaderboard.find().sort({ points: -1 });
    for (let i = 0; i < all.length; i++) {
      all[i].rank = i + 1;
      await all[i].save();
    }

    res.status(201).json({ message: "Entry added", entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Update a leaderboard entry
app.put("/api/admin/leaderboard/:id", async (req, res) => {
  try {
    const { name, avatar, events, wins, points } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (events !== undefined) updates.events = events;
    if (wins !== undefined) updates.wins = wins;
    if (points !== undefined) updates.points = points;

    await Leaderboard.findByIdAndUpdate(req.params.id, updates);

    // Re-rank all entries by points descending
    const all = await Leaderboard.find().sort({ points: -1 });
    for (let i = 0; i < all.length; i++) {
      all[i].rank = i + 1;
      await all[i].save();
    }

    res.status(200).json({ message: "Entry updated" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Delete a leaderboard entry
app.delete("/api/admin/leaderboard/:id", async (req, res) => {
  try {
    await Leaderboard.findByIdAndDelete(req.params.id);

    // Re-rank remaining entries
    const all = await Leaderboard.find().sort({ points: -1 });
    for (let i = 0; i < all.length; i++) {
      all[i].rank = i + 1;
      await all[i].save();
    }

    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
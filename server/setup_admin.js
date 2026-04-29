const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusflux');
    
    const adminEmail = 'admin@campusflux.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('User updated to admin:', adminEmail);
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        fullName: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        department: 'Administration',
        year: 'N/A',
        role: 'admin'
      });
      await newAdmin.save();
      console.log('New admin created:', adminEmail);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();

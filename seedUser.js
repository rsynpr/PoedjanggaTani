require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "demo@poedjangga.com";

    // Cek apakah user sudah ada
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ User sudah ada dengan email:", email);
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const newUser = new User({
      username: "Demo User",
      email: email,
      password: hashedPassword,
      nohp: "081234567890",
      alamat: "Karanglewas, Banyumas",
    });

    await newUser.save();

    console.log("✅ User dummy berhasil ditambahkan:");
    console.log({
      email: newUser.email,
      password: "password123",
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Gagal tambah user dummy:", err.message);
    mongoose.disconnect();
  }
}

seedUser();
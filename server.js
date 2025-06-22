require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Logging opsional (boleh dipertahankan)
app.use((req, res, next) => {
  if (req.method === "POST") {
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      console.log("🧾 RAW BODY:", Buffer.concat(body).toString());
    });
  }
  next();
});

// Ini cukup satu kali
app.use('/api/auth', authRoutes);

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Config Diletakkan di Atas
const corsOptions = {
  origin: [
    'https://poedjangga-tani.vercel.app',
    'http://localhost:5000'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ⬅️ Ini penting untuk OPTIONS

// Middleware Lain
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Logging opsional
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

// Routing API
app.use('/api/auth', authRoutes);

// Connect DB & Start Server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
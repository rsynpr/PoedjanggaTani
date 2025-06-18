// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.registerUser = async (req, res) => {
  const { nama, email, nohp, username, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email sudah digunakan' });

    const newUser = await User.create({ nama, email, nohp, username, password });
    res.status(201).json({
      _id: newUser._id,
      nama: newUser.nama,
      email: newUser.email,
      token: generateToken(newUser._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal register', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        nama: user.nama,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil profil', error: err.message });
  }
};

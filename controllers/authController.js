const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ======== Token Generators ========
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role, 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE || '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRE || '7d' }
  );
}

// ======== Register ========
exports.register = async (req, res) => {
  try {
    const { nama, username, email, password, nohp, alamat } = req.body;

    if (!nama || !username || !email || !password) {
      return res.status(400).json({ error: 'Nama, username, email, dan password wajib diisi' });
    }

    const user = new User({
      nama,
      username,
      email,
      password,
      nohp: nohp || '',
      alamat: alamat || ''
    });

    await user.save();
    console.log("✅ User berhasil dibuat:", user.email);
    res.status(201).json({ message: 'Akun berhasil dibuat' });
  } catch (err) {
    console.error("❌ Error register:", err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar: ' + err.message });
  }
};

// ======== Login ========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    
    res.json({
      accessToken,
      role: user.role
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: 'Login gagal: ' + err.message });
  }
};

// ======== Refresh Token ========
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

// ======== Logout ========
exports.logout = (req, res) => {
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ message: 'Logout berhasil' });
};

// ======== Get User Profile ========
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    res.json({ user });
  } catch (err) {
    console.error(" Gagal ambil profil:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ======== Update Profile ========
exports.updateProfile = async (req, res) => {
  try {
    const { nama, username, email, nohp, alamat } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { nama, username, email, nohp, alamat },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profil berhasil diperbarui', user: updated });
  } catch (err) {
    console.error(" Update profil error:", err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
};


// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'user' });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('userRefreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      role: user.role
    });

  } catch (err) {
    console.error(" Login user error:", err);
    res.status(500).json({ error: 'Login gagal: ' + err.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      role: admin.role
    });

  } catch (err) {
    console.error(" Login admin error:", err);
    res.status(500).json({ error: 'Login gagal: ' + err.message });
  }
};


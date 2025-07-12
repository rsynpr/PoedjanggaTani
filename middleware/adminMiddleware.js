const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal memverifikasi admin', error: err.message });
  }
};

module.exports = { verifyAdmin };

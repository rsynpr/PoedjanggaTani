
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya admin.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Gagal memverifikasi admin' });
  }
};

module.exports = isAdmin;

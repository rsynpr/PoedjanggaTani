const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],

nohp: { type: String, required: true }
,
  alamat: { type: String, required: true },
  metodePembayaran: {
    type: String,
    enum: ['cod', 'transfer', 'ewallet'],
    required: true
  },
  buktiBayar: { type: String, default: '' },
  statusPembayaran: {
    type: String,
    enum: ['pending', 'menunggu konfirmasi', 'diterima', 'gagal'],
    default: 'pending'
  },
  statusPengiriman: {
    type: String,
    enum: ['belum', 'dikirim'],
    default: 'belum'
  },
  statusPenyelesaian: {
    type: String,
    enum: ['belum', 'selesai', 'batal'],
    default: 'belum'
  },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

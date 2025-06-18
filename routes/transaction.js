const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  jumlah: { type: Number, required: true },
  harga: { type: Number, required: true }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  total: { type: Number, required: true },
  metodePembayaran: { type: String, enum: ['transfer', 'cod', 'ewallet'], required: true },
  status: { type: String, default: 'diproses' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
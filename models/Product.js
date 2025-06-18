// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jenis: { type: String, enum: ['sayur', 'buah'], required: true },
  harga: { type: Number, required: true },
  gambar: { type: String }, // URL atau path ke gambar produk
  deskripsi: { type: String },
  stok: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

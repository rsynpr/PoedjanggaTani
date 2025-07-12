// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  harga: {
    type: Number,
    required: true
  },
  stok: {
    type: Number,
    default: 0
  },
  gambar: {
    type: String,
    default: ''
  },
  kategori: {
    type: String,
    enum: ['sayur', 'buah'],
    required: true
  },
  satuan: {
    type: String,
    required: true
  },
  terjual: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

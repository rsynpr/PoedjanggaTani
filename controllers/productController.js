// // controllers/productController.js
// const Product = require('../models/Product');

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil produk', error: err.message });
//   }
// };

// exports.createProduct = async (req, res) => {
//   const { nama, jenis, harga, gambar, deskripsi, stok } = req.body;
//   try {
//     const newProduct = await Product.create({ nama, jenis, harga, gambar, deskripsi, stok });
//     res.status(201).json(newProduct);
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal menambahkan produk', error: err.message });
//   }
// };

// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil detail produk', error: err.message });
//   }
// };

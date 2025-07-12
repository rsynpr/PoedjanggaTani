const Product = require('../models/Product');


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { nama, harga, stok, gambar, kategori, satuan } = req.body;

    if (!nama || !harga || !stok) {
      return res.status(400).json({ message: 'Nama, harga, dan stok wajib diisi.' });
    }

    if (harga <= 0 || stok < 0) {
      return res.status(400).json({ message: 'Harga harus lebih dari 0 dan stok tidak boleh negatif.' });
    }

    const product = new Product({ nama, harga, stok, gambar, kategori, satuan });
    await product.save();

    res.status(201).json({ message: 'Produk berhasil ditambahkan', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah produk' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json({ message: 'Produk berhasil diperbarui', updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
};

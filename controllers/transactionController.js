// controllers/transactionController.js
const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  const { items, total, metodePembayaran } = req.body;
  try {
    const newTransaction = await Transaction.create({
      userId: req.user._id,
      items,
      total,
      metodePembayaran
    });
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan transaksi', error: err.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).populate({
      path: 'items.productId',
      model: 'Product'
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil transaksi', error: err.message });
  }
};

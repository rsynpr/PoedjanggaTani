const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.createTransaction = async (req, res) => {
  try {
    const { items, alamat, metodePembayaran, nohp } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Item tidak boleh kosong.' });
    }

    let statusPembayaran;
    if (metodePembayaran === 'cod') statusPembayaran = 'diterima';
    else if (['transfer', 'ewallet'].includes(metodePembayaran)) statusPembayaran = 'pending';
    else return res.status(400).json({ message: 'Metode pembayaran tidak valid.' });

    let total = 0;

  
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ message: 'Produk tidak ditemukan.' });

      total += product.harga * item.quantity;

      
      if (metodePembayaran === 'cod') {
        if (product.stok < item.quantity) {
          return res.status(400).json({ message: `Stok produk ${product.nama} tidak mencukupi.` });
        }

        product.stok -= item.quantity;
        product.terjual += item.quantity;
        await product.save();
      }
    }

    const trx = new Transaction({
      user: userId,
      items,
      alamat,
      metodePembayaran,
      total,
      statusPembayaran,
      nohp
    });

    const saved = await trx.save();

    res.status(201).json({
      _id: saved._id,
      total: saved.total,
      metodePembayaran: saved.metodePembayaran
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat transaksi', error: err.message });
  }
};



exports.getUserTransactions = async (req, res) => {
  try {
    const transaksi = await Transaction.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat transaksi', error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transaksi = await Transaction.find()
      .populate('user', 'nama email nohp')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat transaksi', error: err.message });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan.' });

    const trx = await Transaction.findById(id);
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    
    if (trx.statusPembayaran === 'diterima') {
      return res.status(400).json({ message: 'Pembayaran sudah dikonfirmasi. Tidak bisa unggah ulang.' });
    }

   
    if (trx.buktiBayar) {
      const oldPath = path.join(__dirname, '..', 'uploads', 'bukti', trx.buktiBayar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

   
    trx.buktiBayar = req.file.filename;

   
    if (trx.metodePembayaran !== 'cod') {
      trx.statusPembayaran = 'menunggu konfirmasi';
    }

    await trx.save();

    res.json({ message: 'Bukti berhasil diunggah', trx });
  } catch (err) {
    res.status(500).json({ message: 'Gagal unggah bukti', error: err.message });
  }
};


exports.resetProof = async (req, res) => {
  try {
    const trx = await Transaction.findById(req.params.id);
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    if (trx.buktiBayar) {
      const filePath = path.join(__dirname, '..', 'uploads', 'bukti', trx.buktiBayar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    trx.buktiBayar = '';
    trx.statusPembayaran = 'pending';
    await trx.save();

    res.json({ message: 'Bukti direset', trx });
  } catch (err) {
    res.status(500).json({ message: 'Gagal reset bukti', error: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const trx = await Transaction.findById(req.params.id).populate('items.product');
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    const { pembayaran, pengiriman, penyelesaian } = req.body;

    
    if (pembayaran) {
      if (pembayaran === 'diterima' && !trx.buktiBayar && trx.metodePembayaran !== 'cod') {
        return res.status(400).json({ message: 'Tidak bisa menerima pembayaran tanpa bukti.' });
      }

      
      if (trx.statusPembayaran !== 'diterima' && pembayaran === 'diterima') {
       
        for (const item of trx.items) {
          const product = await Product.findById(item.product._id);
          if (product) {
            product.stok -= item.quantity;
            product.terjual += item.quantity;
            await product.save();
          }
        }
      }

      trx.statusPembayaran = pembayaran;
    }

    if (pengiriman) trx.statusPengiriman = pengiriman;
    if (penyelesaian) trx.statusPenyelesaian = penyelesaian;

    await trx.save();
    res.json({ message: 'Status diperbarui', trx });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update status', error: err.message });
  }
};


exports.cancelTransaction = async (req, res) => {
  try {
    const trx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    trx.statusPenyelesaian = 'batal';
    await trx.save();
    res.json({ message: 'Transaksi dibatalkan', trx });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membatalkan', error: err.message });
  }
};

exports.getSingleTransaction = async (req, res) => {
  try {
    const trx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product');
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    res.json(trx);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat transaksi', error: err.message });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const trx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product');

    if (!trx) return res.status(404).send('Transaksi tidak ditemukan.');

    const tanggal = new Date(trx.createdAt).toLocaleString('id-ID');
    const html = `
      <html>
        <head>
          <title>Struk Transaksi</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; color: #1bad20; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { font-weight: bold; text-align: right; }
            .center { text-align: center; }
          </style>
        </head>
        <body onload="window.print()">
          <h2>Struk Transaksi - Poedjangga Tani</h2>
          <p><strong>ID Transaksi:</strong> ${trx._id}</p>
          <p><strong>Tanggal:</strong> ${tanggal}</p>
          <p><strong>Metode Pembayaran:</strong> ${trx.metodePembayaran}</p>
          <p><strong>Status Pembayaran:</strong> ${trx.statusPembayaran}</p>

          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${trx.items.map(item => {
                const nama = item.product?.nama || '(Produk dihapus)';
                const harga = item.product?.harga || 0;
                const jumlah = item.quantity;
                const subtotal = harga * jumlah;
                return `
                  <tr>
                    <td>${nama}</td>
                    <td>Rp${harga.toLocaleString('id-ID')}</td>
                    <td>${jumlah}</td>
                    <td>Rp${subtotal.toLocaleString('id-ID')}</td>
                  </tr>
                `;
              }).join('')}
              <tr>
                <td colspan="3" class="total">Total</td>
                <td><strong>Rp${trx.total.toLocaleString('id-ID')}</strong></td>
              </tr>
            </tbody>
          </table>

          <p class="center">Terima kasih telah berbelanja di Poedjangga Tani!</p>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    res.status(500).send('Gagal memuat struk transaksi.');
  }
};


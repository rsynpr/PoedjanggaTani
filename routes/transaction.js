const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  uploadProof,
  updateTransactionStatus,
  resetProof,
  cancelTransaction,
  getSingleTransaction,
  getReceipt
} = require('../controllers/transactionController');

const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');


router.get('/all', verifyToken, verifyAdmin, getAllTransactions); 
router.get('/mine', verifyToken, getUserTransactions); 
router.post('/', verifyToken, createTransaction); 
router.post('/upload/:id', verifyToken, upload.single('bukti'), uploadProof); 
router.put('/reset-bukti/:id', verifyToken, resetProof); 
router.put('/:id/cancel', verifyToken, cancelTransaction); 
router.put('/:id/status', verifyToken, verifyAdmin, updateTransactionStatus); 
router.get('/:id/receipt', verifyToken, getReceipt); 
router.get('/:id', verifyToken, getSingleTransaction); 

module.exports = router;

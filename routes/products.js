// routes/products.js
const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, getProductById } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.post('/', protect, createProduct); // bisa dibatasi admin
router.get('/:id', getProductById);

module.exports = router;

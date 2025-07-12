const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', productController.getAllProducts);
router.get('/detail/:id', productController.getProductById);
router.post('/', verifyToken, isAdmin, productController.addProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);

module.exports = router;

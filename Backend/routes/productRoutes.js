const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getOwnerProducts
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/* =========================
   OWNER ROUTES (FIRST!)
========================= */

// Get owner products
router.get(
  '/owner/my-products',
  protect,
  authorize('owner'),
  getOwnerProducts
);

// Create product
router.post(
  '/',
  protect,
  authorize('owner'),
  upload.single('image'),
  createProduct
);

// Update product
router.put(
  '/:id',
  protect,
  authorize('owner'),
  upload.single('image'),
  updateProduct
);

// Delete product
router.delete(
  '/:id',
  protect,
  authorize('owner'),
  deleteProduct
);

/* =========================
   PUBLIC ROUTES
========================= */

// Get all products
router.get('/', getProducts);

// Get single product (KEEP LAST)
router.get('/:id', getProductById);

module.exports = router;

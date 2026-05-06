import express from 'express';
import { getProducts, updateProduct } from '../controllers/productController.js';

const router = express.Router();

// GET products
router.get('/', getProducts);

// UPDATE product
router.patch('/:id', updateProduct);

export default router;
import { db } from '../data/mockDB.js';
import { updateProductService } from '../services/productService.js';

// ✅ GET ALL PRODUCTS
export const getProducts = (req, res) => {
  res.json(db.products);
};

// ✅ UPDATE PRODUCT
export const updateProduct = (req, res) => {
  try {
    const updated = updateProductService(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
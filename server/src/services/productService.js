import { db } from '../data/mockDB.js';

// ✅ UPDATE PRODUCT SERVICE
export const updateProductService = (id, data) => {
  const product = db.products.find(p => p.id === id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Update fields safely
  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = data.price;
  if (data.stockQty !== undefined) product.stockQty = data.stockQty;
  if (data.available !== undefined) product.available = data.available;

  return product;
};
import express from 'express';
import {
  getAllOrders,
  createOrder,
  approveOrder,
  approveAllOrders
} from '../controllers/orderController.js';

import {
  downloadCSV,
  downloadAllInvoices,
  downloadInvoice,
  getOrdersByCustomer
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);

// ✅ IMPORTANT
router.patch('/approve-all', approveAllOrders);

// ✅ IMPORTANT
router.patch('/:id/approve', approveOrder);

router.get('/download-csv', downloadCSV);
router.get('/:id/invoice', downloadInvoice);
router.get('/download-invoices', downloadAllInvoices);
router.get('/customer-orders', getOrdersByCustomer);
export default router;
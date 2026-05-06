import express from 'express';
import { generateInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

// ✅ Generate invoice for an order
router.post('/:orderId', generateInvoice);

export default router;
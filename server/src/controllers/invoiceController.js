import { generateInvoicePDF } from '../services/invoiceService.js';

export const generateInvoice = (req, res) => {

  console.log("🧾 GENERATE INVOICE HIT");

  try {
    const invoice = generateInvoiceService(req.params.orderId);

    res.json(invoice);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
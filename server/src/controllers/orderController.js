import {
  createOrderService,
  approveOrderService,
  approveAllOrdersService
} from '../services/orderService.js';

import { generateCSV } from '../utils/csvGenerator.js';
import { generateInvoicePDF, generateAllInvoicesPDF } from '../services/invoiceService.js';
import { db } from '../data/mockDB.js';


// =======================
// 🟢 GET ALL ORDERS
// =======================
export const getAllOrders = (req, res) => {
  console.log("📦 GET ALL ORDERS");
  res.json(db.orders);
};


// =======================
// 🔵 CREATE ORDER
// =======================
export const createOrder = (req, res) => {
  console.log("🔥 CREATE ORDER HIT");
  console.log("📩 Request Body:", req.body);

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    const { customerName, customerPhone, items } = req.body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({
        error: "Missing required order fields"
      });
    }

    const order = createOrderService(req.body);

    console.log("✅ ORDER CREATED:", order.id);

    res.status(201).json(order);

  } catch (error) {
    console.log("❌ CREATE ORDER ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
};


// =======================
// 🟡 APPROVE SINGLE ORDER
// =======================
export const approveOrder = (req, res) => {
  console.log("🔥 APPROVE ONE HIT:", req.params.id);

  try {
    const order = approveOrderService(req.params.id);

    console.log("✅ ORDER APPROVED:", order.id);

    res.json(order);

  } catch (error) {
    console.log("❌ APPROVE ONE ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
};


// =======================
// 🟡 APPROVE ALL ORDERS
// =======================
export const approveAllOrders = (req, res) => {
  console.log("🔥 APPROVE ALL HIT");

  try {
    const count = approveAllOrdersService();

    console.log(`✅ BULK APPROVED: ${count}`);

    res.json({ updatedOrders: count });

  } catch (error) {
    console.log("❌ APPROVE ALL ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
};


// =======================
// 🟠 DOWNLOAD CSV
// =======================
export const downloadCSV = (req, res) => {
  const csv = generateCSV(db.orders);

  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().slice(0, 5).replace(":", "-");

  const fileName = `orders_${date}_${time}.csv`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}`
  );

  res.send(csv);
};


// =======================
// 🟣 CUSTOMER ORDERS (FIXED 🔥)
// =======================
export const getOrdersByCustomer = (req, res) => {
  const { phone } = req.query;

  // 🔥 FIX: normalize phone (handles string/number/+91)
  const normalize = (num) => String(num).replace(/\D/g, "");

  const userOrders = db.orders.filter(
    o => normalize(o.customerPhone) === normalize(phone)
  );

  console.log("📱 CUSTOMER ORDERS FETCH:", phone);
  console.log("📦 FOUND:", userOrders.length);

  res.json(userOrders);
};


// =======================
// 🔴 SINGLE INVOICE
// =======================
export const downloadInvoice = (req, res) => {
  const { id } = req.params;

  const order = db.orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = "INVOICED";

  generateInvoicePDF(order, res);
};


// =======================
// 🔴 ALL INVOICES
// =======================
export const downloadAllInvoices = (req, res) => {
  const invoicedOrders = db.orders.filter(
    o => o.status === "INVOICED"
  );

  if (invoicedOrders.length === 0) {
    return res.status(400).json({
      error: "No invoice generated yet"
    });
  }

  generateAllInvoicesPDF(invoicedOrders, res);
};
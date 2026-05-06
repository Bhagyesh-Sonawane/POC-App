import { db } from '../data/mockDB.js';
import { sendWhatsAppMessage } from './whatsappService.js';


// ==============================
// 🟢 CREATE ORDER (WITH STOCK LOGIC)
// ==============================
export const createOrderService = (data) => {

  // ❌ Order window closed
  if (!db.orderWindow.isOpen) {
    throw new Error("We are not accepting orders right now");
  }

  // 🔥 FIX: accept correct keys
  const {
    customerName,
    customerPhone,
    items
  } = data;

  // ❌ Validation
  if (!customerName || !customerPhone || !items || items.length === 0) {
    throw new Error('Invalid order data');
  }

  let total = 0;
  const orderItems = [];

  for (let item of items) {

    const product = db.products.find(p => p.id === item.productId);

    // ❌ Product not found or unavailable
    if (!product || !product.available) {
      throw new Error(`Product not available: ${item.productId}`);
    }

    // ❌ STOCK CHECK
    if (item.qty > product.stockQty) {
      throw new Error(
        `${product.name} only has ${product.stockQty} items left`
      );
    }

    // 💰 Calculate total
    const itemTotal = product.price * item.qty;
    total += itemTotal;

    // 🔥 STOCK DEDUCTION
    product.stockQty -= item.qty;

    // 🔥 AUTO DISABLE PRODUCT
    if (product.stockQty <= 0) {
      product.stockQty = 0;
      product.available = false;
    }

    // Add to order items
    orderItems.push({
      productId: product.id,
      name: product.name,
      qty: item.qty,
      price: product.price
    });
  }

  // 🧾 Create order
  const newOrder = {
    id: `order_${Date.now()}`,
    customerName,
    customerPhone,
    items: orderItems,
    total,
    status: "PENDING",
    createdAt: new Date()
  };

  db.orders.push(newOrder);

  console.log(`📦 Order placed: ${newOrder.id} | Total: ₹${total}`);

  // 📲 WhatsApp confirmation
  sendWhatsAppMessage(
    customerPhone,
    `Your order has been received. Total: ₹${total}`
  );

  return newOrder;
};


// ==============================
// 🟡 APPROVE SINGLE ORDER
// ==============================
export const approveOrderService = (orderId) => {

  const order = db.orders.find(o => o.id === orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'PENDING') {
    throw new Error('Order already processed');
  }

  order.status = 'APPROVED';

  console.log(`✅ Order approved: ${orderId}`);

  return order;
};


// ==============================
// 🔵 APPROVE ALL ORDERS
// ==============================
export const approveAllOrdersService = () => {

  let count = 0;

  db.orders.forEach(order => {
    if (order.status === 'PENDING') {
      order.status = 'APPROVED';
      count++;
    }
  });

  console.log(`✅ Bulk approved ${count} orders`);

  return count;
};
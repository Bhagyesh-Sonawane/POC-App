import { db } from '../data/mockDB.js';

export const generateDeliverySheetService = () => {

  // Get only invoiced orders
  const orders = db.orders.filter(o => o.status === "INVOICED");

  if (orders.length === 0) {
    throw new Error("No invoiced orders found");
  }

  const sheet = orders.map(order => ({
    customerName: order.customerName,
    phone: order.customerPhone,
    items: order.items
  }));

  console.log(`📦 Delivery sheet generated with ${orders.length} orders`);

  return {
    totalOrders: orders.length,
    orders: sheet
  };
};
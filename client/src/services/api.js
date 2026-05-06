import axios from 'axios';

// 🔗 Base API instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});


// =======================
// 🟢 PRODUCTS
// =======================

// Get all products
export const getProducts = () => API.get('/products');

// Update product (Admin)
export const updateProduct = (id, data) =>
  API.patch(`/products/${id}`, data);


// =======================
// 🔵 ORDERS
// =======================

// Create order (Customer)
export const createOrder = (data) => {
  console.log("ORDER PAYLOAD:", data); // 👈 add this
  return API.post('/orders', data);
};

// Get all orders (Admin)
export const getOrders = () =>
  API.get('/orders');

// Approve single order
export const approveOrder = (id) =>
  API.patch(`/orders/${id}/approve`);

// Approve all orders
export const approveAll = () =>
  API.patch('/orders/approve-all');


// =======================
// 🟠 INVOICES
// =======================

// Generate invoice
export const generateInvoice = (id) =>
  API.post(`/invoices/${id}`);


// =======================
// 🔴 ORDER WINDOW
// =======================

// Get order window status
export const getOrderWindow = () =>
  API.get('/order-window');

// Toggle order window
export const toggleWindow = (isOpen) =>
  API.patch('/order-window', { isOpen });

export const getCustomerOrders = (phone) =>
  API.get(`/orders/customer-orders?phone=${phone}`);
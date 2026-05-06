import express from 'express';
import cors from 'cors';

import orderRoutes from './src/routes/orderRoutes.js';
import orderWindowRoutes from './src/routes/orderWindowRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import invoiceRoutes from './src/routes/invoiceRoutes.js';

// ✅ CREATE APP
const app = express();

// ✅ MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://poc-app-xi.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

// ✅ ROUTES
app.use('/api/orders', orderRoutes);
app.use('/api/order-window', orderWindowRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('API Running...');
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
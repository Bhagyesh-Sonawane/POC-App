import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderWindowRoutes from './routes/orderWindowRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG ROUTE
app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-window', orderWindowRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/delivery', deliveryRoutes);

export default app;
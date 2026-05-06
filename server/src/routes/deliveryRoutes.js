import express from 'express';
import { generateDeliverySheet } from '../controllers/deliveryController.js';

const router = express.Router();

router.get('/', generateDeliverySheet);

export default router;
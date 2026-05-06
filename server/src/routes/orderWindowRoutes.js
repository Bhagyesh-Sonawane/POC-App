import express from 'express';
import { getStatus, toggleWindow } from '../controllers/orderWindowController.js';

const router = express.Router();

// ✅ GET STATUS
router.get('/', getStatus);

// ✅ TOGGLE WINDOW
router.patch('/', toggleWindow);

export default router;
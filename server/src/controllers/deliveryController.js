import { generateDeliverySheetService } from '../services/deliveryService.js';

export const generateDeliverySheet = (req, res) => {
  console.log("📦 DELIVERY SHEET HIT");

  try {
    const sheet = generateDeliverySheetService();
    res.json(sheet);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
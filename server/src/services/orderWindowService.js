 import { db } from '../data/mockDB.js';

// ✅ Get status
export const getOrderWindowStatus = () => {
  return db.orderWindow;
};

// ✅ Toggle window
export const toggleOrderWindow = (isOpen) => {
  db.orderWindow.isOpen = isOpen;

  if (isOpen) {
    db.orderWindow.lastOpenedAt = new Date();
  } else {
    db.orderWindow.lastClosedAt = new Date();
  }

  console.log(`🟢 Order window ${isOpen ? 'OPENED' : 'CLOSED'}`);

  return db.orderWindow;
};
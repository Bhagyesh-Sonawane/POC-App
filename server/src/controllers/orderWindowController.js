import { db } from '../data/mockDB.js';

// ✅ Get status
export const getStatus = (req, res) => {
  console.log("🔥 getStatus HIT");

  try {
    res.json(db.orderWindow);
  } catch (error) {
    console.log("❌ getStatus ERROR:", error.message);
    res.status(500).json({ error: "Internal error" });
  }
};


// ✅ Toggle window
export const toggleWindow = (req, res) => {
  console.log("🔥 toggleWindow HIT");

  try {
    const { isOpen } = req.body;

    if (typeof isOpen !== 'boolean') {
      return res.status(400).json({ error: "isOpen must be true/false" });
    }

    db.orderWindow.isOpen = isOpen;

    if (isOpen) {
      db.orderWindow.lastOpenedAt = new Date();
    } else {
      db.orderWindow.lastClosedAt = new Date();
    }

    console.log(`🟢 Order window ${isOpen ? 'OPENED' : 'CLOSED'}`);

    res.json(db.orderWindow);

  } catch (error) {
    console.log("❌ toggleWindow ERROR:", error.message);
    res.status(500).json({ error: "Internal error" });
  }
};
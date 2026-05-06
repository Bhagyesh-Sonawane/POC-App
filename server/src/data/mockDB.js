export const db = {
  products: [
    {
      id: "prod_1",
      name: "Broccoli",
      price: 120,
      available: true,
      stockQty: 50
    },
    {
      id: "prod_2",
      name: "Lettuce",
      price: 80,
      available: true,
      stockQty: 40
    },
    {
      id: "prod_3",
      name: "Red Cabbage",
      price: 90,
      available: true,
      stockQty: 30
    },
    {
      id: "prod_4",
      name: "Zucchini",
      price: 70,
      available: true,
      stockQty: 25
    }
  ],

  orders: [],
  invoices: [],

  orderWindow: {
    isOpen: true
  }
};
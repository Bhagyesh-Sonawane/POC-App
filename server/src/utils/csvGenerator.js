export const generateCSV = (orders) => {

  let csv = "Order ID,Customer Name,Phone,Products,Qty,Total,Status,Date,Time\n";

  orders.forEach(order => {

    const products = order.items.map(i => i.name).join(" | ");
    const qtys = order.items.map(i => i.qty).join(" | ");

    // 🕒 FORMAT DATE & TIME
    const dateObj = new Date(order.createdAt);

   const date = dateObj.toLocaleDateString("en-GB"); 
const time = dateObj.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit"
});

    csv += `${order.id},${order.customerName},${order.customerPhone},"${products}","${qtys}",${order.total},${order.status},${date},${time}\n`;
  });

  return csv;
};
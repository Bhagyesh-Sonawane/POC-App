import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, res) => {

  const doc = new PDFDocument({ margin: 50 });

  const fileName = `invoice_${order.id}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}`
  );

  doc.pipe(res);

  // 🔷 HEADER
  doc
    .fontSize(22)
    .fillColor("#2e7d32")
    .text("EXOTIC VEGGIES", { align: "left" });

  doc
    .fontSize(18)
    .fillColor("black")
    .text("INVOICE", { align: "right" });

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Order ID: ${order.id}`);
  doc.text(`Customer: ${order.customerName}`);
  doc.text(`Phone: ${order.customerPhone}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);

  doc.moveDown(1.5);

  // 🔷 TABLE HEADER
  const y = doc.y;

  doc
    .font("Helvetica-Bold")
    .text("Product", 50, y)
    .text("Qty", 250, y)
    .text("Price", 320, y)
    .text("Total", 420, y);

  doc.moveDown(0.5);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  doc.moveDown();

  // 🔷 ITEMS
  doc.font("Helvetica");

  order.items.forEach(item => {
    const lineTotal = item.qty * item.price;

    doc
      .text(item.name, 50)
      .text(item.qty, 250)
      .text(`Rs ${item.price}`, 320)
      .text(`Rs ${lineTotal}`, 420);

    doc.moveDown();
  });

  doc.moveDown();

  // 🔷 TOTAL BOX
  doc
    .rect(350, doc.y, 200, 40)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Total: Rs ${order.total}`, 360, doc.y + 10);

  doc.moveDown(3);

  // 🔷 FOOTER
  doc
    .fontSize(10)
    .text("Thank you for choosing Exotic Veggies!", {
      align: "center"
    });

  doc.end();
};

export const generateAllInvoicesPDF = (orders, res) => {

  const doc = new PDFDocument({ margin: 50 });

  const fileName = `all_invoices_${Date.now()}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}`
  );

  doc.pipe(res);

  orders.forEach((order, index) => {

    if (index !== 0) doc.addPage();

    // 🔷 HEADER
    doc
      .fontSize(20)
      .text("EXOTIC VEGGIES", { align: "left" });

    doc
      .fontSize(16)
      .text("INVOICE", { align: "right" });

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Order ID: ${order.id}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.text(`Phone: ${order.customerPhone}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);

    doc.moveDown();

    // ITEMS
    order.items.forEach(item => {
      const total = item.qty * item.price;

      doc.text(
        `${item.name} | Qty: ${item.qty} | Rs ${item.price} | Rs ${total}`
      );
    });

    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .text(`Total: Rs ${order.total}`);
  });

  doc.end();
};
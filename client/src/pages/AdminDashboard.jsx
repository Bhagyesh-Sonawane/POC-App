import { useEffect, useState } from 'react';
import {
  getOrders,
  approveOrder,
  generateInvoice,
  getProducts,
  updateProduct,
  getOrderWindow,
  toggleWindow
} from '../services/api';

import Toast from '../components/common/Toast';



function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
 

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchWindow();
  }, []);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const fetchWindow = async () => {
    const res = await getOrderWindow();
    setIsOpen(res.data.isOpen);
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 3000);
  }, [toast]);

  // 🔥 Toggle Order Window
  const handleToggleWindow = async () => {
    await toggleWindow(!isOpen);
    setIsOpen(!isOpen);
    setToast({
      message: `Order Window ${!isOpen ? "Opened" : "Closed"}`,
      type: "success"
    });
  };

  // ORDER ACTIONS
  const handleApprove = async (id) => {
    await approveOrder(id);
    setToast({ message: "Order Approved", type: "success" });
    fetchOrders();
  };

  const handleInvoice = async (id) => {
    await generateInvoice(id);
    setToast({ message: "Invoice Generated", type: "success" });
    fetchOrders();
  };

  const handleDownloadInvoices = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/download-invoices`
      );

      // ❌ If no invoices
      if (!res.ok) {
        const data = await res.json();

        setToast({
          message: data.error || "No invoice generated yet",
          type: "error"
        });

        return;
      }

      // ✅ If PDF exists
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "all_invoices.pdf";
      a.click();

    } catch (err) {
      setToast({
        message: "Something went wrong",
        type: "error"
      });
    }
  };
  // PRODUCT EDIT
  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSaveProduct = async (p) => {
    await updateProduct(p.id, p);
    setToast({ message: "Product Updated", type: "success" });
    fetchProducts();
  };

  return (
    <div style={styles.wrapper}>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <button style={styles.logout} onClick={onLogout}>
        Logout
      </button>

      <div style={styles.container}>
        <h2 style={styles.heading}>Admin Dashboard</h2>

        {/* ORDER WINDOW */}
        <div style={styles.windowControl}>
          <span>
            Status:{" "}
            <b style={{ color: isOpen ? "green" : "red" }}>
              {isOpen ? "OPEN" : "CLOSED"}
            </b>
          </span>

          <button style={styles.toggleBtn} onClick={handleToggleWindow}>
            {isOpen ? "Close Orders" : "Open Orders"}
          </button>
        </div>


        <div style={styles.stats}>
          <div style={styles.card}>
            <h4>Total Orders</h4>
            <p>{orders.length}</p>
          </div>

          <div style={styles.card}>
            <h4>Revenue</h4>
            <p>₹{orders.reduce((sum, o) => sum + o.total, 0)}</p>
          </div>

          <div style={styles.card}>
            <h4>Pending</h4>
            <p>{orders.filter(o => o.status === "PENDING").length}</p>
          </div>
        </div>


        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "orders" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button
            style={activeTab === "products" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>


        <div style={styles.topActions}>
          <button
            style={styles.downloadBtn}
            onClick={() =>
              window.open(`${import.meta.env.VITE_API_URL}/api/orders/download-csv`)
            }
            onMouseOver={e => e.target.style.opacity = "0.85"}
            onMouseOut={e => e.target.style.opacity = "1"}
          >
            Download CSV
          </button>

          {orders.some(o => o.status === "INVOICED") && (
            <button
              style={styles.downloadBtn}
              onClick={handleDownloadInvoices}
              onMouseOver={e => e.target.style.opacity = "0.85"}
              onMouseOut={e => e.target.style.opacity = "1"}
            >
              Download Invoices
            </button>
          )}
        </div>

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    style={index % 2 === 0 ? styles.rowAlt : {}}
                  >
                    <td style={styles.td}>
                      <b>{order.id}</b>
                    </td>

                    <td style={styles.td}>{order.customerName}</td>
                    <td style={styles.td}>{order.customerPhone}</td>

                    {/* Products */}
                    <td style={styles.td}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={styles.productItem}>
                          {item.name}
                        </div>
                      ))}
                    </td>

                    {/* Qty */}
                    <td style={styles.td}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={styles.productItem}>
                          {item.qty}
                        </div>
                      ))}
                    </td>

                    <td style={styles.td}>₹{order.total}</td>

                    <td style={styles.td}>
                      {order.status === "PENDING" && (
                        <button
                          style={styles.actionBtn}
                          onClick={() => handleApprove(order.id)}
                        >
                          Approve
                        </button>
                      )}

                      {order.status === "APPROVED" && (
                        <button
                          style={styles.actionBtn}
                          onClick={() => {
                            window.open(`${import.meta.env.VITE_API_URL}/api/orders/${order.id}/invoice`);
                            setTimeout(fetchOrders, 500); // 🔥 refresh UI
                          }}
                        >
                          Generate Invoice
                        </button>
                      )}

                      {order.status === "INVOICED" && (
                        <span style={{ color: "green", fontWeight: "500" }}>
                          Invoice Generated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Save</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p, index) => (
                  <tr
                    key={p.id}
                    style={index % 2 === 0 ? styles.rowAlt : {}}
                  >
                    <td style={styles.td}>
                      <input
                        value={p.name}
                        onChange={(e) =>
                          handleProductChange(p.id, "name", e.target.value)
                        }
                      />
                    </td>

                    <td style={styles.td}>
                      <input
                        type="number"
                        value={p.price}
                        onChange={(e) =>
                          handleProductChange(p.id, "price", Number(e.target.value))
                        }
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={p.stockQty === 0 ? '' : p.stockQty}
                        onChange={(e) =>
                          handleProductChange(
                            p.id,
                            "stockQty",
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
                      />

                      {/* 🔥 LOW STOCK WARNING */}
                      {p.stockQty > 0 && p.stockQty <= 3 && (
                        <div style={styles.lowStock}>Low stock</div>
                      )}

                      {p.stockQty === 0 && (
                        <div style={styles.outStock}>Out of stock</div>
                      )}
                    </td>

                    <td style={styles.td}>
                      <select
                        value={p.available}
                        onChange={(e) =>
                          handleProductChange(
                            p.id,
                            "available",
                            e.target.value === "true"
                          )
                        }
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleSaveProduct(p)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: 20,
    background: "#f4f6f8",
    minHeight: "100vh",
    position: "relative"
  },

  topActions: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px"
  },

  topActions: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px"
  },
  container: {
    maxWidth: 1100,
    margin: "auto",
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
  },

  heading: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: "24px",
    fontWeight: "600"
  },

  tab: {
    padding: "8px 14px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    borderRadius: 6
  },

  activeTab: {
    padding: "8px 14px",
    border: "1px solid #1976d2",
    background: "#1976d2",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 6
  },
  windowControl: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25
  },

  toggleBtn: {
    padding: "8px 14px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    minWidth: "700px",
    borderCollapse: "collapse",
    borderRadius: 10,
    overflow: "hidden"
  },

  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f1f3f5",
    borderBottom: "2px solid #ddd",
    fontWeight: "600"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  rowAlt: {
    background: "#fafafa"
  },

  productItem: {
    padding: "2px 0"
  },

  lowStock: {
    color: "orange",
    fontSize: "12px",
    marginTop: 4
  },

  outStock: {
    color: "red",
    fontSize: "12px",
    marginTop: 4
  },

  stats: {
    display: "flex",
    gap: 15,
    marginBottom: 25
  },

  downloadBtn: {
    padding: "8px 14px",
    background: "#0288d1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  card: {
    flex: 1,
    background: "#ffffff",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    border: "1px solid #eee",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
  },

  actionBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: 5,
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  logout: {
    position: "absolute",
    right: 20,
    top: 20
  }


};

export default AdminDashboard;
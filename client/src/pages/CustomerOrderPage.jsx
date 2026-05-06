import { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../services/api';
import useStore from '../store/useStore';

import Toast from '../components/common/Toast';
import OrderClosedModal from '../components/customer/OrderClosedModal';
import { productImages } from '../utils/productImages';
import MyOrders from "./MyOrders";

function CustomerOrderPage({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState(null);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [view, setView] = useState("products");

  const isOpen = useStore((state) => state.isOrderWindowOpen);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    if (!isOpen) setShowClosedModal(true);
  }, [isOpen]);

  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 3000);
  }, [toast]);

  // 🔥 QTY VALIDATION
  const handleQtyChange = (id, value, stock, name) => {
    if (value === '') {
      setCart({ ...cart, [id]: '' });
      return;
    }

    const qty = Number(value);

    if (qty > stock) {
      setToast({
        message: `Only ${stock} ${name} available`,
        type: "error"
      });
      return;
    }

    setCart({ ...cart, [id]: qty });
  };

  // 🔥 REVIEW CLICK
  const handlePlaceClick = () => {
    for (let p of products) {
      const qty = cart[p.id] || 0;

      if (qty > p.stockQty) {
        setToast({
          message: `Only ${p.stockQty} ${p.name} available`,
          type: "error"
        });
        return;
      }
    }

    const items = products
      .map(p => ({
        productId: p.id,
        qty: cart[p.id] || 0
      }))
      .filter(i => i.qty > 0);

    if (items.length === 0) {
      setToast({ message: "Select at least 1 product", type: "error" });
      return;
    }

    setShowReview(true);
  };

  // 🔥 FINAL ORDER (FIXED HERE)
  const handleConfirmOrder = async () => {
    const items = products
      .map(p => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        qty: cart[p.id] || 0
      }))
      .filter(i => i.qty > 0);

    try {
      console.log("FINAL ORDER:", {
        customerName: user.name,
        customerPhone: user.phone,
        items
      });

      await createOrder({
        customerName: user.name,
        customerPhone: user.phone,
        items
      });

      setCart({});
      setShowReview(false);

      setToast({
        message: "Order placed successfully!",
        type: "success"
      });

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      setToast({
        message: err.response?.data?.error || "Error placing order",
        type: "error"
      });
    }
  };

  const visibleProducts = products.filter(
    p => p.available && p.stockQty > 0
  );

  const reviewItems = visibleProducts
    .map(p => ({
      name: p.name,
      price: p.price,
      qty: cart[p.id] || 0,
      total: (cart[p.id] || 0) * p.price
    }))
    .filter(i => i.qty > 0);

  const total = reviewItems.reduce((sum, i) => sum + i.total, 0);

  return (
    <div style={styles.wrapper}>

      {toast && <Toast message={toast.message} type={toast.type} />}
      {showClosedModal && (
        <OrderClosedModal
          onExit={() => setShowClosedModal(false)}
        />
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>🥦 Product Dashboard</h2>

          <button
            style={styles.logoutBtn}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <div style={styles.topNav}>
          <button
            style={view === "products" ? styles.activeTab : styles.tab}
            onClick={() => setView("products")}
          >
            Products
          </button>

          <button
            style={view === "orders" ? styles.activeTab : styles.tab}
            onClick={() => setView("orders")}
          >
            My Orders
          </button>
        </div>
        {view === "products" && (
          <>
            {!isOpen ? (
              <div style={styles.closedWrapper}>
                <h2 style={styles.closedTitle}>
                  Thank You for coming by 👋
                </h2>

                <p style={styles.closedText}>
                  We will update you on WhatsApp once we are live again!
                </p>
              </div>
            ) : (
              <>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.thCenter}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((p, i) => (
                      <tr key={p.id} style={i % 2 === 0 ? styles.rowAlt : {}}>
                        <td style={styles.td}>
                          <img src={productImages[p.id]} style={styles.img} />
                        </td>
                        <td style={styles.td}>{p.name}</td>
                        <td style={styles.td}>₹{p.price}</td>
                        <td style={styles.tdCenter}>
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={cart[p.id] === '' ? '' : cart[p.id] || ''}
                            onChange={(e) =>
                              handleQtyChange(
                                p.id,
                                e.target.value,
                                p.stockQty,
                                p.name
                              )
                            }
                            style={styles.input}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button style={styles.btn} onClick={handlePlaceClick}>
                  Place Order
                </button>
              </>
            )}
          </>
        )}

        {view === "orders" && (
          <MyOrders user={user} />
        )}
      </div>

      {showReview && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Review Order</h3>

            {reviewItems.map((i, idx) => (
              <div key={idx} style={styles.row}>
                <span>{i.name}</span>
                <span>{i.qty}</span>
                <span>₹{i.total}</span>
              </div>
            ))}

            <hr />
            <h4>Total: ₹{total}</h4>

            <button onClick={() => setShowReview(false)}>
              Edit Order
            </button>

            <button onClick={handleConfirmOrder}>
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



const styles = {
  wrapper: {
    padding: 20,
    background: "#f4f6f8",
    minHeight: "100vh"
  },

  container: {
    maxWidth: 800,
    margin: "auto",
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  logoutBtn: {
    padding: "6px 14px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },

  heading: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: "22px",
    fontWeight: "600"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20
  },

  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f1f3f5",
    borderBottom: "2px solid #ddd",
    fontWeight: "600"
  },

  thCenter: {
    textAlign: "center",
    padding: "12px",
    background: "#f1f3f5",
    borderBottom: "2px solid #ddd"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  tdCenter: {
    textAlign: "center",
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  closedWrapper: {
    padding: "60px 20px",
    textAlign: "center"
  },

  closedTitle: {
    color: "#2e7d32",
    marginBottom: "12px"
  },

  closedText: {
    color: "#666",
    fontSize: "16px"
  },

  rowAlt: {
    background: "#fafafa"
  },

  img: {
    width: 40,
    height: 40,
    borderRadius: 6
  },

  input: {
    width: 70,
    padding: "6px",
    textAlign: "center",
    borderRadius: 6,
    border: "1px solid #ccc",
    outline: "none"
  },

  topNav: {
    display: "flex",
    gap: 10,
    marginBottom: 20
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
    border: "1px solid #2e7d32",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 6
  },

  btn: {
    width: "100%",
    padding: 14,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 320
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8
  }
};

export default CustomerOrderPage;
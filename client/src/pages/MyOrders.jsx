import { useEffect, useState } from "react";
import { getCustomerOrders } from "../services/api";

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const normalize = (num) => String(num).replace(/\D/g, "");

  const fetchOrders = async () => {
    try {
      const phone = normalize(user.phone);

      console.log("📱 FETCHING FOR:", phone);

      const res = await getCustomerOrders(phone);

      console.log("📦 RESPONSE:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.orders || [];

      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setOrders([]);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: 20 }}>
        No orders placed yet.
      </p>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Order ID</th>
          <th style={styles.th}>Items</th>
          <th style={styles.th}>Total</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Date</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, i) => (
          <tr key={order.id} style={i % 2 === 0 ? styles.rowAlt : {}}>
            
            <td style={styles.td}>{order.id}</td>

            <td style={styles.td}>
              {order.items.map((item, idx) => (
                <div key={idx}>
                  {item.name} x {item.qty}
                </div>
              ))}
            </td>

            <td style={styles.td}>₹{order.total}</td>

            <td style={styles.td}>
              <span
                style={
                  order.status === "PENDING"
                    ? styles.pending
                    : order.status === "APPROVED"
                    ? styles.approved
                    : styles.invoiced
                }
              >
                {order.status}
              </span>
            </td>

            <td style={styles.td}>
              {new Date(order.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20
  },
  th: {
    padding: 12,
    borderBottom: "2px solid #ddd",
    textAlign: "left"
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #eee"
  },
  rowAlt: {
    background: "#fafafa"
  },
  pending: {
    color: "orange",
    fontWeight: "600"
  },
  approved: {
    color: "#1976d2",
    fontWeight: "600"
  },
  invoiced: {
    color: "green",
    fontWeight: "600"
  }
};

export default MyOrders;
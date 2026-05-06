function ProductList({ products, onQtyChange }) {
  return (
    <div style={styles.container}>
      {products.map((p) => (
        <div key={p.id} style={styles.card}>
          
          {/* Product Info */}
          <div style={styles.info}>
            <h3 style={styles.name}>{p.name}</h3>
            <p style={styles.price}>₹{p.price}</p>
          </div>

          {/* Quantity Input */}
          <div>
            <input
              type="number"
              min="0"
              placeholder="Qty"
              style={styles.input}
              onChange={(e) => onQtyChange(p.id, e.target.value)}
            />
          </div>

        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  info: {
    display: "flex",
    flexDirection: "column",
  },

  name: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  price: {
    margin: "4px 0 0 0",
    color: "#4CAF50",
    fontWeight: "500",
  },

  input: {
    width: "70px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
};

export default ProductList;
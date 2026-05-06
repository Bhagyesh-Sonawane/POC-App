import { useState } from 'react';
import { productImages } from '../../utils/productImages';

function ProductDetailModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(0);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <img
          src={productImages[product.id]}
          alt={product.name}
          style={styles.image}
        />

        <h2>{product.name}</h2>

        <p style={styles.price}>₹{product.price}</p>

        <p>
          {product.available ? "✅ In Stock" : "❌ Out of Stock"}
        </p>

        <p>Available Qty: {product.stockQty}</p>

        <input
          type="number"
          min="0"
          max={product.stockQty}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={styles.input}
          disabled={!product.available}
        />

        <button
          style={styles.addBtn}
          disabled={!product.available}
          onClick={() => {
            onAdd(product.id, qty);
            onClose();
          }}
        >
          Add to Cart
        </button>

        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}

const styles = {
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
    borderRadius: 12,
    width: "320px",
    textAlign: "center"
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  price: {
    fontSize: "18px",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px"
  },

  addBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },

  closeBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px"
  }
};

export default ProductDetailModal;
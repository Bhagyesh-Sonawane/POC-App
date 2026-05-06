import { useState } from 'react';

function ProductDetailModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <h3>Edit Product</h3>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        <input
          type="number"
          value={form.stockQty}
          onChange={(e) =>
            setForm({ ...form, stockQty: Number(e.target.value) })
          }
        />

        <select
          value={form.available}
          onChange={(e) =>
            setForm({ ...form, available: e.target.value === "true" })
          }
        >
          <option value="true">Available</option>
          <option value="false">Out of Stock</option>
        </select>

        <button onClick={() => onSave(form)}>Save</button>
        <button onClick={onClose}>Close</button>

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
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
};

export default ProductDetailModal;
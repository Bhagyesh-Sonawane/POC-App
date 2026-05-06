function OrderClosedModal({ onExit }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>🚫 Ordering Closed</h2>

        <p style={styles.text}>
          We are not accepting orders right now.
        </p>

        <p style={styles.subText}>
          Please wait for the next WhatsApp notification.
        </p>

        <button style={styles.button} onClick={onExit}>
          OK
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "320px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "10px"
  },

  text: {
    fontWeight: "500"
  },

  subText: {
    fontSize: "13px",
    color: "#666",
    marginTop: "10px"
  },

  button: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default OrderClosedModal;
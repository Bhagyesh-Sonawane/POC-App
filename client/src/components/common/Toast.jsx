function Toast({ message, type, onClose }) {
  return (
    <div style={{
      ...styles.toast,
      backgroundColor: type === "error" ? "#f44336" : "#4CAF50"
    }}>
      {message}
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 9999,
    fontSize: "14px"
  }
};

export default Toast;
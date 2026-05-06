import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (!name.trim()) {
      alert("Enter name");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter valid 10-digit phone");
      return;
    }

    // 🔐 Admin check
    if (phone === "1234567890") {
      onLogin({ role: "admin", name: "Rohit", phone });
    } else {
      onLogin({ role: "customer", name, phone });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          placeholder="Your Name"
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          style={styles.input}
          maxLength={10}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPhone(val);
          }}
        />

        <button style={styles.button} onClick={handleLogin}>
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa"
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "12px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default LoginPage;
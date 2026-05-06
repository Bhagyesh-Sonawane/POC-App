import { useState, useEffect } from 'react';

import CustomerOrderPage from './pages/CustomerOrderPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

import useStore from './store/useStore';
import { getOrderWindow } from './services/api';

function App() {

  // ✅ Safe user loading (no crash)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored || stored === "undefined") return null;

      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const setOrderWindow = useStore((state) => state.setOrderWindow);

  // 🔄 Save user to localStorage
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔓 Logout (clean reset)
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 Fetch order window status
  useEffect(() => {
    getOrderWindow().then(res => {
      setOrderWindow(res.data.isOpen);
    });
  }, []);

  // 🔐 Routing
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <CustomerOrderPage user={user} onLogout={handleLogout} />;
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import AdminOrders from "./pages/Adminorders";
import AdminAddProduct from "./pages/AdminAddProduct";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProfilePage from "./pages/ProfilePage";
import SuperAdminAnalytics from "./pages/SuperAdminAnalytics.jsx";
import DeliveryAnalytics from "./pages/DeliveryAnalytics";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = !!userInfo;

  if (loading) return null;

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Protected */}
        {isLoggedIn && (
          <>
            <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
            <Route path="/superadmin/analytics" element={<><SuperAdminAnalytics /></>} />
            <Route path="/admin/dashboard" element={<><Navbar /><AdminOrders /></>} />
            <Route path="/admin/add-product" element={<><Navbar /><AdminAddProduct /></>} />
            <Route path="/delivery/analytics" element={<><DeliveryAnalytics /></>} />
            <Route path="/delivery/dashboard" element={<><Navbar /><DeliveryDashboard /></>} />
          </>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/profile" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

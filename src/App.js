import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import AdminOrders from "./pages/Adminorders";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProfilePage from "./pages/ProfilePage";
import AdminAnalytics from "./pages/AdminAnalytics";
import DeliveryAnalytics from "./pages/DeliveryAnalytics";
import Navbar from "./pages/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Protected (show navbar only if logged in) */}
        {isLoggedIn && (
          <>
            <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
            <Route path="/admin/analytics" element={<><Navbar /><AdminAnalytics /></>} />
            <Route path="/admin/dashboard" element={<><Navbar /><AdminOrders /></>} />
            <Route path="/delivery/analytics" element={<><Navbar /><DeliveryAnalytics /></>} />
            <Route path="/delivery/dashboard" element={<><Navbar /><DeliveryDashboard /></>} />
          </>
        )}

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/profile" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import AdminOrders from "./pages/Adminorders";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import AdminAnalytics from "./pages/AdminAnalytics";

<ToastContainer position="top-right" autoClose={5000} />


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/delivery/analytics" element={<DeliveryDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/dashboard" element={<AdminOrders />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

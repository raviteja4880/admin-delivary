import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import AdminOrders from "./pages/Adminorders";
import AdminAddProduct from "./pages/AdminAddProduct";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProfilePage from "./pages/ProfilePage";
import SuperAdminAnalytics from "./pages/SuperAdminAnalytics.jsx";
import DeliveryAnalytics from "./pages/DeliveryAnalytics";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Profile (any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
        </Route>

        {/* Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/superadmin/analytics" element={<SuperAdminAnalytics />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<><Navbar /><AdminOrders /></>} />
          <Route path="/admin/add-product" element={<><Navbar /><AdminAddProduct /></>} />
        </Route>

        {/* Delivery */}
        <Route element={<ProtectedRoute allowedRoles={["delivery"]} />}>
          <Route path="/delivery/dashboard" element={<><Navbar /><DeliveryDashboard /></>} />
          <Route path="/delivery/analytics" element={<><Navbar /><DeliveryAnalytics /></>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

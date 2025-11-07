import React, { useEffect, useState } from "react";
import { adminAPI } from "../services/api";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  IndianRupee,
  Loader2,
  ClipboardCheck,
  PackageOpen,
  BarChart3,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  setLoading(true);
  try {
    const [ordersRes, partnersRes] = await Promise.all([
      adminAPI.getAllOrders(),
      adminAPI.getDeliveryPartners(),
    ]);
    setOrders(ordersRes.data);
    setPartners(partnersRes.data);
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load admin data. Check backend connectivity.");
  } finally {
    setLoading(false);
  }
};


  const handleAssign = async (orderId, partnerId) => {
    try {
      await adminAPI.assignDelivery(orderId, partnerId);
      await loadData();
    } catch (error) {
      console.error("Error assigning delivery partner:", error);
      alert("Assignment failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-secondary">
        <Loader2 className="me-2 spinner-border text-primary" />
        Loading orders...
      </div>
    );

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;
  const pendingOrders = totalOrders - deliveredOrders;

  return (
    <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold text-dark d-flex align-items-center gap-2">
          <BarChart3 size={26} className="text-primary" />
          Manage Orders
        </h2>
        <button
          onClick={loadData}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-start border-primary border-4 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Orders</p>
                <h4 className="fw-bold">{totalOrders}</h4>
              </div>
              <ClipboardCheck size={30} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-start border-success border-4 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Delivered</p>
                <h4 className="fw-bold text-success">{deliveredOrders}</h4>
              </div>
              <CheckCircle size={30} className="text-success" />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-start border-danger border-4 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Pending</p>
                <h4 className="fw-bold text-danger">{pendingOrders}</h4>
              </div>
              <PackageOpen size={30} className="text-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle table-hover table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th className="text-center">Paid</th>
                <th className="text-center">Delivered</th>
                <th className="text-center">Delivery Partner</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="d-flex align-items-center gap-2">
                      <User size={16} className="text-secondary" />
                      {order.user?.name || "Unknown"}
                    </td>
                    <td className="fw-medium">
                      <IndianRupee size={14} className="text-muted me-1" />
                      {order.totalPrice}
                    </td>
                    <td className="text-center">
                      {order.isPaid ? (
                        <CheckCircle
                          size={20}
                          className="text-success"
                          title="Paid"
                        />
                      ) : (
                        <XCircle size={20} className="text-danger" title="Unpaid" />
                      )}
                    </td>
                    <td className="text-center">
                      {order.isDelivered ? (
                        <CheckCircle
                          size={20}
                          className="text-success"
                          title="Delivered"
                        />
                      ) : (
                        <XCircle
                          size={20}
                          className="text-danger"
                          title="Pending"
                        />
                      )}
                    </td>
                    <td className="text-center">
                      <select
                        value={order.assignedTo?._id || ""}
                        onChange={(e) => handleAssign(order._id, e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="">-- Assign --</option>
                        {partners.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={loadData}
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        title="Refresh"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

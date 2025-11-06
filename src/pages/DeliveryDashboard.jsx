import React, { useEffect, useState } from "react";
import { deliveryAPI } from "../services/api";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Truck,
  MapPin,
  Package,
  RefreshCw,
  User,
  IndianRupee,
} from "lucide-react";
import "../DeliveryDashboard.css"; 

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await deliveryAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
      alert("Failed to fetch orders. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await deliveryAPI.markDelivered(orderId);
      await fetchOrders();
    } catch (error) {
      console.error("Error marking order delivered:", error);
      alert("Failed to update delivery status.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-secondary">
        <Loader2 className="me-2 spinner-border text-primary" />
        Loading assigned deliveries...
      </div>
    );

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;
  const pendingOrders = totalOrders - deliveredOrders;

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold text-dark d-flex align-items-center gap-2">
          <Truck size={26} className="text-primary" />
          Delivery Partner Dashboard
        </h2>
        <button
          onClick={fetchOrders}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 d-flex">
          <div className="card border-start border-primary border-4 shadow-sm flex-fill">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Deliveries</p>
                <h4 className="fw-bold mb-0">{totalOrders}</h4>
              </div>
              <Package size={32} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="col-md-4 d-flex">
          <div className="card border-start border-success border-4 shadow-sm flex-fill">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Delivered</p>
                <h4 className="fw-bold text-success mb-0">
                  {deliveredOrders}
                </h4>
              </div>
              <CheckCircle size={32} className="text-success" />
            </div>
          </div>
        </div>

        <div className="col-md-4 d-flex">
          <div className="card border-start border-danger border-4 shadow-sm flex-fill">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Pending</p>
                <h4 className="fw-bold text-danger mb-0">{pendingOrders}</h4>
              </div>
              <XCircle size={32} className="text-danger" />
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
                <th>Address</th>
                <th>Total</th>
                <th className="text-center">Delivered</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order._id}>
        {/* Customer */}
        <td className="align-middle">
          <div className="d-flex align-items-center gap-2">
            <User size={16} className="text-secondary" />
            <span>{order.user?.name || "Unknown"}</span>
          </div>
        </td>

        {/* Address */}
        <td className="align-middle">
          <div className="d-flex align-items-center gap-2">
            <MapPin size={16} className="text-muted" />
            <span className="text-truncate" style={{ maxWidth: "200px" }}>
              {order.shippingAddress || "No address"}
            </span>
          </div>
        </td>

        {/* Total */}
        <td className="align-middle text-nowrap fw-medium">
          <div className="d-flex align-items-center gap-1">
            <IndianRupee size={14} className="text-muted" />
            <span>{order.totalPrice?.toFixed(2)}</span>
          </div>
        </td>

        {/* Delivered */}
        <td className="text-center align-middle">
          {order.isDelivered ? (
            <CheckCircle size={20} className="text-success" />
          ) : (
            <XCircle size={20} className="text-danger" />
          )}
        </td>

        {/* Action */}
        <td className="text-center align-middle">
          {!order.isDelivered && (
            <button
              onClick={() => markDelivered(order._id)}
              className="btn btn-success btn-sm d-flex align-items-center gap-1 mx-auto"
            >
              <CheckCircle size={16} />
              Mark Delivered
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-muted py-4">
        No assigned deliveries yet.
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

export default DeliveryDashboard;

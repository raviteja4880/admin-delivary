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
  Phone,
  ExternalLink,
  CreditCard,
  Wallet,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../DeliveryDashboard.css";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await deliveryAPI.getMyOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
      toast.error("Failed to fetch orders. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Filtering and Sorting Logic =====
  useEffect(() => {
    let filtered = [...orders];

    if (paymentFilter !== "all") {
      filtered = filtered.filter((o) =>
        paymentFilter === "paid" ? o.isPaid : !o.isPaid
      );
    }

    if (deliveryFilter !== "all") {
      filtered = filtered.filter((o) =>
        deliveryFilter === "delivered" ? o.isDelivered : !o.isDelivered
      );
    }

    // Sorting
    if (sortOption === "amountHigh") {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortOption === "amountLow") {
      filtered.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortOption === "newest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOption === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    setFilteredOrders(filtered);
  }, [paymentFilter, deliveryFilter, sortOption, orders]);

  const markDelivered = async (orderId) => {
    if (updatingId) return;
    setUpdatingId(orderId);
    try {
      await deliveryAPI.markDelivered(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, isDelivered: true } : o
        )
      );
      toast.success("Order marked as delivered");
    } catch (error) {
      console.error("Error marking delivered:", error);
      toast.error("Failed to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const markPaid = async (orderId) => {
    if (!window.confirm("Confirm COD payment received?")) return;
    if (updatingId) return;
    setUpdatingId(orderId);
    try {
      await deliveryAPI.markPaid(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isPaid: true } : o))
      );
      toast.success("COD payment confirmed");
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Failed to mark as paid.");
    } finally {
      setUpdatingId(null);
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
      <ToastContainer position="top-right" autoClose={3000} />

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

      {/* STATS */}
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
                <h4 className="fw-bold text-success mb-0">{deliveredOrders}</h4>
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

      {/* FILTER BAR */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 bg-light rounded-3 shadow-sm">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <Filter size={18} className="text-secondary" />
            <span className="fw-semibold">Filters:</span>
          </div>
          <select
            className="form-select form-select-sm"
            style={{ width: 160 }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            className="form-select form-select-sm"
            style={{ width: 180 }}
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
          >
            <option value="all">All Deliveries</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <ArrowUpDown size={18} className="text-secondary" />
          <select
            className="form-select form-select-sm"
            style={{ width: 180 }}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amountHigh">Amount: High → Low</option>
            <option value="amountLow">Amount: Low → High</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle table-hover table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer Info</th>
                <th>Address</th>
                <th>Total</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Delivered</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    {/* Customer Info */}
                    <td className="align-middle">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center gap-2">
                          <User size={16} className="text-secondary" />
                          <strong>{order.user?.name || "Unknown"}</strong>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1 text-muted small">
                          <Phone size={14} />
                          <span>{order.mobile || "No phone available"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="align-middle">
                      <div className="d-flex align-items-start gap-2">
                        <MapPin size={16} className="text-muted mt-1" />
                        <div>
                        <span className="address-text">
                          {order.shippingAddress || "No address provided"}
                        </span>
                          {order.shippingAddress && (
                            <div>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  order.shippingAddress
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary small d-inline-flex align-items-center mt-1"
                              >
                                <ExternalLink size={12} className="me-1" />
                                View on Maps
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="align-middle text-nowrap fw-medium">
                      <div className="d-flex align-items-center gap-1">
                        <IndianRupee size={14} className="text-muted" />
                        <span>{order.totalPrice?.toFixed(2)}</span>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="text-center align-middle">
                      {order.paymentMethod === "COD" ? (
                        order.isPaid ? (
                          <span className="text-success d-flex justify-content-center align-items-center gap-1">
                            <CreditCard size={16} /> Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => markPaid(order._id)}
                            disabled={updatingId === order._id}
                            className="btn btn-sm btn-warning d-flex align-items-center gap-1 mx-auto"
                          >
                            <Wallet size={16} />
                            {updatingId === order._id ? "Updating..." : "Mark as Paid"}
                          </button>
                        )
                      ) : order.isPaid ? (
                        <span className="text-success d-flex justify-content-center align-items-center gap-1">
                          <CreditCard size={16} /> Paid
                        </span>
                      ) : (
                        <span className="text-danger d-flex justify-content-center align-items-center gap-1">
                          <XCircle size={16} /> Unpaid
                        </span>
                      )}
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
                          disabled={updatingId === order._id || !order.isPaid}
                          className={`btn btn-sm d-flex align-items-center gap-1 mx-auto ${
                            !order.isPaid ? "btn-secondary disabled-btn" : "btn-success"
                          }`}
                          style={{
                            cursor: !order.isPaid ? "not-allowed" : "pointer",
                            opacity: !order.isPaid ? 0.6 : 1,
                          }}
                        >
                          <CheckCircle size={16} />
                          {updatingId === order._id ? "Updating..." : "Mark Delivered"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No orders found with current filters.
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

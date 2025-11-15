import React, { useEffect, useState, useMemo } from "react";
import { adminAPI } from "../services/api";
import "../AdminOrders.css";
import {
  CheckCircle,
  RefreshCw,
  User,
  IndianRupee,
  Loader2,
  ClipboardCheck,
  PackageOpen,
  BarChart3,
  Lock,
  CreditCard,
  Clock,
  Filter,
  ArrowUpDown,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // ========== FILTER & SORT LOGIC ==========
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    switch (filter) {
      case "paid":
        filtered = filtered.filter((o) => o.isPaid);
        break;
      case "unpaid":
        filtered = filtered.filter((o) => !o.isPaid);
        break;
      case "delivered":
        filtered = filtered.filter((o) => o.isDelivered);
        break;
      case "pending":
        filtered = filtered.filter((o) => !o.isDelivered && !o.isCanceled);
        break;
      case "cancelled":
        filtered = filtered.filter((o) => o.isCanceled);
        break;
      case "assigned":
        filtered = filtered.filter((o) => !!o.assignedTo);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case "priceLow":
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    return filtered;
  }, [orders, filter, sortBy]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-secondary">
        <Loader2 className="me-2 spinner-border text-primary" />
        Loading orders...
      </div>
    );

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;
  const pendingOrders = orders.filter( (o) => !o.isDelivered && !o.isCanceled).length;

  return (
    <div className="container py-4">
      {/* HEADER */}
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

      {/* FILTER & SORT BAR */}
      <div className="card shadow-sm border-0 mb-3 p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-6 d-flex align-items-center gap-2">
            <Filter size={18} className="text-primary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-6 d-flex align-items-center gap-2">
            <ArrowUpDown size={18} className="text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="priceLow">Price: Low → High</option>
            </select>
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
                <th className="text-center">Payment</th>
                <th className="text-center">Status</th>
                <th className="text-center">Delivery Partner</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isAssigned = !!order.assignedTo;

                  return (
                      <tr className={order.isCanceled ? "cancelled-row" : ""}>

                      {/* Customer */}
                      <td className="d-flex align-items-center gap-2">
                        <User size={16} className="text-secondary" />
                        {order.user?.name || "Unknown"}
                      </td>

                      {/* Total */}
                      <td className="fw-medium">
                        <IndianRupee size={14} className="text-muted me-1" />
                        {order.totalPrice?.toFixed(2)}
                      </td>

                      {/* Payment */}
                      <td className="text-center">
                        {order.isPaid ? (
                          <span className="badge bg-success d-flex justify-content-center align-items-center gap-1">
                            <CreditCard size={14} />
                            Paid
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark d-flex justify-content-center align-items-center gap-1">
                            <Clock size={14} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        {order.isCanceled ? (
                          <div className="d-flex justify-content-center align-items-center gap-1">
                            <span className="badge bg-danger">Cancelled</span>

                            {/* Tooltip Reason */}
                            <span
                              title={order.cancelReason || "No reason given"}
                              style={{
                                cursor: "pointer",
                                color: "#dc3545",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              ⓘ
                            </span>
                          </div>
                        ) : order.isDelivered ? (
                          <span className="badge bg-success">Delivered</span>
                        ) : (
                          <span className="badge bg-danger">Pending</span>
                        )}
                      </td>

                      {/* Delivery Partner */}
                      <td className="text-center">
                        {isAssigned ? (
                          <div className="d-flex justify-content-center align-items-center gap-2 text-muted">
                            <span>
                              {order.assignedTo?.name || "Assigned"}
                            </span>
                            <Lock size={16} className="text-secondary" />
                          </div>
                        ) : order.isCanceled ? (
                          <span className="text-danger small fw-bold">
                            Cancelled
                          </span>
                        ) : (
                          <select
                            value={order.assignedTo?._id || ""}
                            onChange={(e) =>
                              handleAssign(order._id, e.target.value)
                            }
                            className="form-select form-select-sm"
                          >
                            <option value="">-- Assign --</option>
                            {partners.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Action */}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No matching orders found
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

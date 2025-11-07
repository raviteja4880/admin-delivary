// src/pages/DeliveryAnalytics.jsx
import React, { useEffect, useState } from "react";
import { deliveryAPI } from "../services/api";
import { CheckCircle, XCircle, CalendarCheck, Truck } from "lucide-react";
import DashboardNavbar from "../components/Navbar";

const DeliveryAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await deliveryAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Delivery analytics load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-secondary">
        Loading analytics...
      </div>
    );

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;
  const pendingOrders = totalOrders - deliveredOrders;

  const today = new Date().toISOString().split("T")[0];
  const todayDelivered = orders.filter(
    (o) => o.isDelivered && o.deliveredAt?.split("T")[0] === today
  ).length;

  return (
    <>
      <DashboardNavbar />
      <div className="container py-4">
        <h2 className="fw-semibold mb-4">🚚 Delivery Partner Analytics</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-primary border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Deliveries</p>
                  <h4 className="fw-bold">{totalOrders}</h4>
                </div>
                <Truck size={36} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-start border-success border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Delivered Orders</p>
                  <h4 className="fw-bold text-success">{deliveredOrders}</h4>
                </div>
                <CheckCircle size={36} className="text-success" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-start border-danger border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Pending Orders</p>
                  <h4 className="fw-bold text-danger">{pendingOrders}</h4>
                </div>
                <XCircle size={36} className="text-danger" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-start border-warning border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Today Delivered</p>
                  <h4 className="fw-bold text-warning">{todayDelivered}</h4>
                </div>
                <CalendarCheck size={36} className="text-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryAnalytics;

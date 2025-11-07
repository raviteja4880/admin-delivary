// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { adminAPI } from "../services/api";
import { IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";
import DashboardNavbar from "../pages/Navbar";

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Analytics Load Error:", error);
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

  const totalIncome = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;

  // Example monthly growth data
  const monthlyData = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + order.totalPrice;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));

  return (
    <>
      <DashboardNavbar />
      <div className="container py-4">
        <h2 className="fw-semibold mb-4">📈 Admin Analytics Overview</h2>

        {/* KPI CARDS */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-primary border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Income</p>
                  <h4 className="fw-bold">
                    <IndianRupee size={16} /> {totalIncome.toFixed(2)}
                  </h4>
                </div>
                <IndianRupee size={36} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-start border-success border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Orders</p>
                  <h4 className="fw-bold text-success">{totalOrders}</h4>
                </div>
                <ShoppingBag size={36} className="text-success" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-start border-info border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Delivered Orders</p>
                  <h4 className="fw-bold text-info">{deliveredOrders}</h4>
                </div>
                <TrendingUp size={36} className="text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="card shadow-sm border-0 p-4">
          <h5 className="fw-semibold mb-3">Monthly Revenue Growth</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#007bff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;

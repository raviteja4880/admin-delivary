// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminAPI } from "../services/api";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart3,
} from "lucide-react";
import DashboardNavbar from "../components/Navbar";

const COLORS = ["#007bff", "#28a745", "#ffc107", "#17a2b8", "#dc3545"];

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

  // === Stats ===
  const totalIncome = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;

  // === Monthly trend data ===
  const monthlyData = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + order.totalPrice;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  }));

  // === Weekly data for pie charts ===
  const getWeekNumber = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const diff =
      d - firstDay + (firstDay.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  };

  const weeklyData = {};
  orders.forEach((o) => {
    const week = `Week ${getWeekNumber(o.createdAt)}`;
    if (!weeklyData[week]) weeklyData[week] = { income: 0, orders: 0 };
    weeklyData[week].income += o.totalPrice;
    weeklyData[week].orders += 1;
  });

  const weeklyIncomeData = Object.entries(weeklyData).map(([week, data]) => ({
    name: week,
    value: data.income,
  }));
  const weeklyOrderData = Object.entries(weeklyData).map(([week, data]) => ({
    name: week,
    value: data.orders,
  }));

  return (
    <>
      <DashboardNavbar />
      <div className="container py-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <BarChart3 size={26} className="text-primary" />
          <h2 className="fw-semibold mb-0">Admin Analytics Overview</h2>
        </div>

        {/* === KPI CARDS === */}
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

        {/* === CHARTS SECTION === */}
        <div className="row g-4">
          {/* Monthly Revenue Line Chart */}
          <div className="col-lg-12">
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <LineIcon size={22} className="text-primary" />
                <h5 className="fw-semibold mb-0">Monthly Revenue Growth</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#007bff"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Comparisons (Pie Charts) */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <PieIcon size={22} className="text-success" />
                <h5 className="fw-semibold mb-0">Weekly Income Distribution</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={weeklyIncomeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {weeklyIncomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <PieIcon size={22} className="text-warning" />
                <h5 className="fw-semibold mb-0">Weekly Orders Distribution</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={weeklyOrderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    dataKey="value"
                    label
                  >
                    {weeklyOrderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;

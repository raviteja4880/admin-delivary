import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";
import { deliveryAPI } from "../services/api";
import {
  CheckCircle,
  Truck,
  Package,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import DashboardNavbar from "../components/Navbar";

const COLORS = ["#28a745", "#dc3545", "#ffc107", "#17a2b8"];

const DeliveryAnalytics = () => {
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
      console.error("Error fetching delivery analytics:", error);
      alert("Failed to load analytics data.");
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

  // Calculate today’s delivered orders
  const today = new Date().toISOString().split("T")[0];
  const todayDelivered = orders.filter(
    (o) => o.isDelivered && o.deliveredAt?.split("T")[0] === today
  ).length;

  // Pie Chart Data — Delivered vs Pending
  const pieData = [
    { name: "Delivered", value: deliveredOrders },
    { name: "Pending", value: pendingOrders },
  ];

  // Daily deliveries for Bar Chart (past 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const dailyData = last7Days.map((date) => {
    const count = orders.filter(
      (o) => o.isDelivered && o.deliveredAt?.split("T")[0] === date
    ).length;
    return {
      day: new Date(date).toLocaleDateString("default", { weekday: "short" }),
      deliveries: count,
    };
  });

  return (
    <>
      <DashboardNavbar />
      <div className="container py-4">
        {/* HEADER */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <Truck size={26} className="text-primary" />
          <h2 className="fw-semibold mb-0">Delivery Partner Analytics</h2>
        </div>

        {/* KPI CARDS */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-primary border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Assigned Orders</p>
                  <h4 className="fw-bold">{totalOrders}</h4>
                </div>
                <Package size={36} className="text-primary" />
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
            <div className="card shadow-sm border-start border-info border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Today's Deliveries</p>
                  <h4 className="fw-bold text-info">{todayDelivered}</h4>
                </div>
                <TrendingUp size={36} className="text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="row g-4">
          {/* PIE CHART — Delivered vs Pending */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <PieIcon size={22} className="text-success" />
                <h5 className="fw-semibold mb-0">Delivery Status Breakdown</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
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

          {/* BAR CHART — Daily Deliveries */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <BarChart3 size={22} className="text-primary" />
                <h5 className="fw-semibold mb-0">Deliveries This Week</h5>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#007bff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryAnalytics;

import axios from "axios";

// ----------------- Dynamic Base URL -----------------
const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

// ----------------- Axios instance -----------------
const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ----------------- Attach JWT token automatically -----------------
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ----------------- Global Response Handling -----------------
API.interceptors.response.use(
  (res) => res,
  (err) => {
  if (err.response?.status === 401) {
    if (window.location.pathname !== "/") {
      localStorage.clear();
      window.location.href = "/";
    }
  }
    return Promise.reject(err);
  }
);

// ================= AUTH API =================
export const authAPI = {
  login: (payload) => API.post("/auth/login", payload),
  register: (payload) => API.post("/auth/register", payload),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (data) => API.put("/auth/profile", data),
};

// ================= ADMIN API =================
export const adminAPI = {
  getAllOrders: () => API.get("/admin/orders"),
  assignDelivery: (orderId, deliveryPartnerId) => API.put(`/admin/orders/${orderId}/assign`, { deliveryPartnerId }),
  getDeliveryPartners: () => API.get("/admin/delivery"),
  updateInventory: (id, payload) => API.put(`/admin/inventory/${id}`, payload),
  addProduct: (formData) =>API.post("/admin/products", formData, { headers: { "Content-Type": "multipart/form-data" },}),
};

// ----------------- Super Admin API -----------------
export const superAdminAPI = {
  getAnalytics: () => API.get("/admin/superadmin/analytics"),
};

// ================= DELIVERY API =================
export const deliveryAPI = {
  getMyOrders: () => API.get("/delivery/my-orders"),
  markDelivered: (id) => API.put(`/delivery/${id}/deliver`),
  markPaid: (id) => API.put(`/delivery/${id}/mark-paid`),
};


export { API };

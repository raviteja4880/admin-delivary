import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data.user || data));
      localStorage.setItem("token", data.token);

      const userRole = data.user?.role || data.role;

      if (userRole === "admin") {
        alert("Welcome back, Admin!");
        navigate("/admin/dashboard");
      } else if (userRole === "delivery") {
        alert("Welcome back, Delivery Partner!");
        navigate("/delivery/dashboard");
      } else {
        toast.error("Access denied — not an admin or delivery partner.");
      }

      toast.success("Login successful!");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      alert(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });

      toast.success("Registration successful! Please login.");
      alert("🎉 Registration successful! You can now login.");
      setActiveTab("login");
    } catch (err) {
      console.error("Register error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again later.";
      alert(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  // ================= UI =================
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-4"
      >
        <h1 className="fw-bold display-5">TejaCommerce Control Center</h1>
        <p className="text-light fs-5">
          Manage orders, delivery & operations from one secure portal ⚙️
        </p>
      </motion.div>

      {/* Auth Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="card shadow-lg p-4 border-0"
          style={{
            width: "100%",
            maxWidth: "430px",
            borderRadius: "1rem",
            background: "rgba(255,255,255,0.9)",
            color: "#333",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Role Selector (Register only) */}
          {activeTab === "register" && (
            <div className="d-flex justify-content-center gap-3 mb-3">
              <button
                className={`btn btn-sm ${
                  role === "admin" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
              <button
                className={`btn btn-sm ${
                  role === "delivery" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setRole("delivery")}
              >
                Delivery Partner
              </button>
            </div>
          )}

          {/* Animated Forms */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
              >
                <h4 className="text-center mb-4">Welcome Back</h4>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
              >
                <h4 className="text-center mb-4">Create Account</h4>

                <div className="mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Links */}
          <p className="text-center mt-3 mb-0">
            {activeTab === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  type="button"
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  type="button"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-light-50 text-center"
        style={{ fontSize: "0.9rem" }}
      >
        © {new Date().getFullYear()} TejaCommerce Control Center
      </motion.footer>
    </div>
  );
};

export default AuthLanding;

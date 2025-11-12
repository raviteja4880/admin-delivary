import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        navigate("/admin/dashboard");
      } else if (userRole === "delivery") {
        navigate("/delivery/dashboard");
      } else {
        toast.error("Access denied — not an admin or delivery partner.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "delivery",
      });

      toast.success("Registration successful! You can now log in.");
      setActiveTab("login");
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err.response?.data?.message || "Registration failed.");
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
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-4"
      >
        <h1 className="fw-bold display-5">TejaCommerce Control Center</h1>
        <p className="text-light fs-5">
          Manage orders, delivery & operations from one secure portal
        </p>
      </motion.div>

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
                  className="btn btn-primary w-100 fw-semibold"
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
                <h4 className="text-center mb-4">Delivery Partner Registration</h4>

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
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter your 10-digit mobile number"
                    required
                    pattern="[6-9][0-9]{9}"
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
                  className="btn btn-success w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register as Delivery Partner"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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

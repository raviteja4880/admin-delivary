import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Truck, BarChart3, UserCircle } from "lucide-react";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Role-based links
  const role = userInfo?.role;

  const navLinks =
    role === "admin"
      ? [
          {
            to: "/admin/analytics",
            label: "Analytics",
            icon: <BarChart3 size={18} />,
          },
          {
            to: "/admin/dashboard",
            label: "Orders",
            icon: <BarChart3 size={18} />,
          },
        ]
      : role === "delivery"
      ? [
          {
            to: "/delivery/analytics",
            label: "Analytics",
            icon: <Truck size={18} />,
          },
          {
            to: "/delivery/dashboard",
            label: "Deliveries",
            icon: <Truck size={18} />,
          },
        ]
      : [];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <div className="container">
        {/* BRAND LINK — redirect by role */}
        <Link
          to={
            userInfo?.role === "admin"
              ? "/admin/analytics"
              : userInfo?.role === "delivery"
              ? "/delivery/analytics"
              : "/profile"
          }
          className="navbar-brand fw-bold text-primary"
        >
          TejaCommerce
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#dashboardNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="dashboardNav">
          <ul className="navbar-nav me-auto gap-lg-3">
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link
                  to={link.to}
                  className="nav-link d-flex align-items-center gap-2 fw-medium"
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* PROFILE DROPDOWN */}
          {userInfo && (
            <div className="nav-item dropdown" ref={dropdownRef}>
              <div
                className="nav-link d-flex align-items-center gap-2 fw-medium"
                style={{ cursor: "pointer" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <UserCircle size={22} />
                <span>{userInfo.name || "Account"}</span>
              </div>

              {dropdownOpen && (
                <ul
                  className="dropdown-menu dropdown-menu-end show shadow border-0 mt-2"
                  style={{
                    position: "absolute",
                    right: 0,
                    borderRadius: "10px",
                    minWidth: "220px",
                  }}
                >
                  <li className="dropdown-item text-center py-2 border-bottom">
                    <strong>{userInfo.name}</strong>
                    <div className="text-muted small">{userInfo.email}</div>
                    <div
                      className={`badge mt-1 ${
                        role === "admin" ? "bg-primary" : "bg-success"
                      }`}
                    >
                      {role?.toUpperCase()}
                    </div>
                  </li>

                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item d-flex align-items-center gap-2"
                    >
                      <User size={16} />
                      Edit Profile
                    </Link>
                  </li>

                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

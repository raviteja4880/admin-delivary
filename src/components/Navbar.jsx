import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Truck,
  BarChart3,
  PackageSearch,
  UserCircle,
  PlusSquare,
} from "lucide-react";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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

  const role = userInfo?.role;

 // ================= ROLE-BASED NAV LINKS =================
const navLinks =
  role === "admin"
    ? [
        {
          to: "/admin/dashboard",
          label: "Manage Orders",
          icon: <PackageSearch size={18} />,
        },
        {
          to: "/admin/add-product",
          label: "Add Product",
          icon: <PlusSquare size={18} />, 
        },
      ]
    : role === "superadmin"
    ? [
        {
          to: "/superadmin/analytics",
          label: "Analytics Overview",
          icon: <BarChart3 size={18} />,
        },
      ]
    : role === "delivery"
    ? [
        {
          to: "/delivery/dashboard",
          label: "My Deliveries",
          icon: <Truck size={18} />,
        },
        {
          to: "/delivery/analytics",
          label: "Delivery Analytics",
          icon: <BarChart3 size={18} />,
        },
      ]
    : [];


  // ================= BRAND REDIRECT BASED ON ROLE =================
  const brandLink =
    role === "admin"
      ? "/admin/dashboard"
      : role === "superadmin"
      ? "/superadmin/analytics"
      : role === "delivery"
      ? "/delivery/dashboard"
      : "/";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        zIndex: 999,
      }}
    >
      <div className="container">
        {/* === Brand === */}
        <Link
          to={brandLink}
          className="navbar-brand fw-bold text-primary"
          style={{ fontSize: "1.4rem", letterSpacing: "0.5px" }}
        >
          TejaCommerce
        </Link>

        {/* === Toggler === */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#dashboardNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* === Nav Links (aligned right) === */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="dashboardNav"
        >
          <ul className="navbar-nav align-items-lg-center gap-lg-3">
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link
                  to={link.to}
                  className="nav-link d-flex align-items-center gap-2 fw-medium"
                  style={{
                    color: "#333",
                    transition: "color 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "#0d6efd")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.color = "#333")}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}

            {/* === Profile Dropdown === */}
            {userInfo && (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <div
                  className="nav-link d-flex align-items-center gap-2 fw-medium"
                  style={{ cursor: "pointer", color: "#333" }}
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
                      minWidth: "230px",
                      padding: "0.5rem",
                      background: "white",
                    }}
                  >
                    {/* === User Info === */}
                    <li
                      className="dropdown-item text-center border-bottom pb-2"
                      style={{ background: "#f8f9fa", borderRadius: "8px" }}
                    >
                      <strong>{userInfo.name}</strong>
                      <div className="text-muted small">{userInfo.email}</div>
                      <div
                        className={`badge mt-1 ${
                          role === "superadmin"
                            ? "bg-dark"
                            : role === "admin"
                            ? "bg-primary"
                            : "bg-success"
                        }`}
                      >
                        {role?.toUpperCase()}
                      </div>
                    </li>

                    {/* === Edit Profile === */}
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-primary fw-semibold"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                        style={{
                          padding: "0.7rem 1rem",
                          borderRadius: "8px",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#f0f8ff")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <User size={16} />
                        Edit Profile
                      </button>
                    </li>

                    {/* === Logout === */}
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger fw-semibold"
                        onClick={handleLogout}
                        style={{
                          padding: "0.7rem 1rem",
                          borderRadius: "8px",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#fff5f5")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

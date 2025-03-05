import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, User, LogOut } from "lucide-react";
import "./../../styles/AppMenu.css";
import logo from "../../../public/logo.png";

const pages = [
  { name: "AI", path: "/ai-recommendations", icon: <Brain size={24} /> },
  { name: "Profile", path: "/profile", icon: <User size={24} /> },
  { name: "Logout", path: "/login", icon: <LogOut size={24} /> }
];

const AppMenu: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app-menu">
      {/* App Logo */}
      <img
        src={logo}
        alt="App Logo"
        className="app-logo"
        onClick={() => setShowMenu(!showMenu)}
      />

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="menu-dropdown">
          {pages.map((page) => (
            <div
              key={page.path}
              className="menu-item"
              onMouseEnter={() => setHoveredPage(page.name)}
              onMouseLeave={() => setHoveredPage(null)}
              onClick={() => {
                if (page.name === "Logout") {
                  handleLogout();
                } else {
                  navigate(page.path);
                }
              }}
            >
              {page.icon}
              {hoveredPage === page.name && <span className="menu-text">{page.name}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppMenu;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, User,PlusCircle, LogOut, Menu, MessageSquare } from "lucide-react";
import "./../../styles/AppMenu.css";
import { logoutUser } from "../../services/user-service";

const pages = [
  { name: "AI", path: "/ai-recommendations", icon: <Brain size={24} /> },
  { name: "Posts", path: "/posts", icon: <MessageSquare size={24} /> },
  { name: "Profile", path: "/profile", icon: <User size={24} /> },
  { name: "AddPost", path: "/addPost", icon: <PlusCircle size={24} /> },
  { name: "Logout", path: "/login", icon: <LogOut size={24} /> }
];

const AppMenu: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="app-menu" ref={menuRef}>
      <Menu
        size={24}
        className="menu-icon"
        onClick={() => setShowMenu(!showMenu)}
      />

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
                  setShowMenu(false);
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
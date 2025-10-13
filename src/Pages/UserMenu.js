import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "./UserMenu.css"; // we'll add simple styles

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear user session here if needed
    navigate("/login");
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="avatar" onClick={() => setOpen(!open)}>
        <FiUser size={20} />
      </div>
      {open && (
        <div className="dropdown">
          <Link to="/profile" className="dropdown-item">
            <FiUser /> Profile
          </Link>
          <button className="dropdown-item" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

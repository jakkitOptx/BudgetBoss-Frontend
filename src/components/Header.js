// Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล user จาก localStorage

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold">Financial Management System</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-600 font-semibold">
            Welcome, {user.firstName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <nav className="p-4">
        <ul>
          <li className="mb-4">
            <Link to="/" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/quotations" className="hover:text-gray-300">
              Quotation Management
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/approvals" className="hover:text-gray-300">
              Approval Management
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/users" className="hover:text-gray-300">
              User Management
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/logs" className="hover:text-gray-300">
              Logs
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

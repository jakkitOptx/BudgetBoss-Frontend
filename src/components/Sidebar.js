// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isFlowMenuOpen, setIsFlowMenuOpen] = useState(false);

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0">
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

          {/* Flow Management Dropdown */}
          <li className="mb-4">
            <button
              className="w-full text-left hover:text-gray-300 flex justify-between items-center"
              onClick={() => setIsFlowMenuOpen(!isFlowMenuOpen)}
            >
              Flow Management
              <span>{isFlowMenuOpen ? "▼" : "▶"}</span>
            </button>

            {isFlowMenuOpen && (
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <Link to="/approve-flow" className="hover:text-gray-300">
                    ➤ Create Flow
                  </Link>
                </li>
                <li>
                  <Link to="/manage-flows" className="hover:text-gray-300">
                    ➤ Manage Flows
                  </Link>
                </li>
              </ul>
            )}
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

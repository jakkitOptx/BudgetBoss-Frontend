// Layout.js
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar คงที่ */}
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header className="sticky top-0 z-10" />
        {/* Content Scroll ได้ */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

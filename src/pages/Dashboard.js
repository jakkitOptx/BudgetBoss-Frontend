import React, { useState, useEffect } from "react";
import axios from "axios";
import SummaryCard from "../components/SummaryCard";
import QuotationTable from "../components/QuotationTable";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [quotations, setQuotations] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/quotations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const pending = data.filter((q) => q.approvalStatus === "Pending").length;

        setQuotations(data.slice(0, 10));
        setPendingCount(pending);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedQuotations = [...quotations].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setQuotations(sortedQuotations);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="p-6">
      {user && (
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, {user.firstName}!
        </h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SummaryCard
          title="Pending Approvals"
          value={pendingCount}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
        />
        <SummaryCard
          title="Total Quotations"
          value={quotations.length}
          bgColor="bg-green-100"
          textColor="text-green-800"
        />
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Latest 10 Quotations</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : quotations.length > 0 ? (
          <QuotationTable
            quotations={quotations}
            sortConfig={sortConfig}
            handleSort={handleSort}
            getSortIndicator={getSortIndicator}
          />
        ) : (
          <p className="text-gray-500">No quotations found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

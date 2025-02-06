// ApprovalManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiURL } from "../config/config";
import ApprovalTable from "../components/ApprovalTable";

const ApprovalManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
          const response = await axios.get(`${apiURL}quotations/approval-by-email/${user.username}`);
          setQuotations(response.data);
        }
      } catch (error) {
        console.error("Error fetching approval quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Approval Management</h1>

      {loading ? (
        <p className="text-gray-600">Loading approvals...</p>
      ) : (
        <ApprovalTable quotations={quotations} />
      )}
    </div>
  );
};

export default ApprovalManagement;

// ApprovalManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiURL } from "../config/config";
import ApprovalTable from "../components/ApprovalTable";
import { ClipLoader } from "react-spinners"; // ✅ ใช้ react-spinners
import { toast } from "react-toastify"; // ✅ ใช้ react-toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import styles

const ApprovalManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
          const response = await axios.get(
            `${apiURL}quotations/approval-by-email/${user.username}`
          );
          setQuotations(response.data);
        }
      } catch (error) {
        console.error("Error fetching approval quotations:", error);
        toast.error("Failed to load approval quotations ❌");
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
        <div className="flex justify-center items-center min-h-[300px]">
          <ClipLoader color="#6366F1" loading={loading} size={60} />
        </div>
      ) : (
        <ApprovalTable quotations={quotations} />
      )}
    </div>
  );
};

export default ApprovalManagement;


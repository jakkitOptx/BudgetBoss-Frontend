import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { apiURL } from "../config/config";


const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
        const response = await axios.get(
          `${apiURL}quotations`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
            },
          }
        );
        setQuotations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  // ฟังก์ชันลบ Quotation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiURL}quotations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuotations((prev) => prev.filter((q) => q._id !== id));
        alert("Quotation deleted successfully.");
      } catch (error) {
        console.error("Error deleting quotation:", error);
        alert("Failed to delete quotation.");
      }
    }
  };

  // กรองรายการตามคำค้นหา
  const filteredQuotations = quotations.filter((q) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      q.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      (q.client && q.client.toLowerCase().includes(lowerCaseSearchTerm)) ||
      q._id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quotation Management</h1>

      {/* เพิ่มปุ่มสร้าง Quotation */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by title, client, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded"
        />
        <button
          onClick={() => navigate("/quotations/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create Quotation
        </button>
      </div>

      {/* ตารางแสดง Quotation */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Quotations</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredQuotations.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Title</th>
                <th className="border-b py-2">Client</th>
                <th className="border-b py-2">Create Date</th>
                <th className="border-b py-2">Amount (THB)</th>
                <th className="border-b py-2">Status</th>
                <th className="border-b py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((q) => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="py-2">{q.title}</td>
                  <td className="py-2">{q.client || "N/A"}</td>
                  <td className="py-2">
                    {q.documentDate
                      ? new Date(q.documentDate).toLocaleDateString("th-TH", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="py-2">
                    {q.netAmount
                      ? q.netAmount.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })
                      : "-"}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        q.approvalStatus === "Approved"
                          ? "bg-green-100 text-green-700"
                          : q.approvalStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : q.approvalStatus === "Rejected" ||
                            q.approvalStatus === "Canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {q.approvalStatus}
                    </span>
                  </td>
                  <td className="py-2 flex space-x-2">
                    {/* ปุ่ม View */}
                    <Link
                      to={`/quotations/${q._id}`}
                      className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                    >
                      <FaEye className="mr-2" /> View
                    </Link>

                    {/* ปุ่ม Edit */}
                    <button
                      onClick={() => navigate(`/quotations/edit/${q._id}`)}
                      className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>

                    {/* ปุ่ม Delete */}
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No quotations found.</p>
        )}
      </div>
    </div>
  );
};

export default QuotationManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล user จาก localStorage

  // สถานะของข้อมูล
  const [quotations, setQuotations] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API เมื่อโหลดหน้า
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/quotations",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ส่ง Token ไปใน Header
            },
          }
        );

        const data = response.data;

        // แยกสถานะที่ยังไม่อนุมัติ
        const pending = data.filter(
          (q) => q.approvalStatus === "Pending"
        ).length;

        setQuotations(data.slice(0, 5)); // แสดงเฉพาะ 5 รายการล่าสุด
        setPendingCount(pending);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  return (
    <div className="p-6">
      {/* แสดงชื่อผู้ใช้ */}
      {user && (
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, {user.firstName}!
        </h1>
      )}

      {/* แสดงข้อมูลภาพรวม */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-blue-800">
            Pending Approvals
          </h2>
          <p className="text-2xl font-bold text-blue-900">{pendingCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-green-800">
            Total Quotations
          </h2>
          <p className="text-2xl font-bold text-green-900">
            {quotations.length}
          </p>
        </div>
      </div>

      {/* แสดงรายการใบเสนอราคาล่าสุด */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Latest Quotations</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : quotations.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Run Number</th>
                <th className="border-b py-2">Type</th>
                <th className="border-b py-2">Title</th>
                <th className="border-b py-2">Client</th>
                <th className="border-b py-2">Create Date</th>
                <th className="border-b py-2">Status</th>
                <th className="border-b py-2">Amount (THB)</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q._id}>
                  <td className="py-2">{q.runNumber}</td>
                  <td className="py-2">{q.type}</td>
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
                  <td className="py-2">
                    {q.netAmount
                      ? q.netAmount.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })
                      : "-"}
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

export default Dashboard;

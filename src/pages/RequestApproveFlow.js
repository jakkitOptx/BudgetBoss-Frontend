import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../config/config"; // ใช้ API URL จาก Config

const RequestApproveFlow = () => {
  const navigate = useNavigate();
  const { quotationId } = useParams(); // รับ ID ของใบเสนอราคาที่พึ่งสร้าง
  const [flowDetails, setFlowDetails] = useState(null); // เก็บรายละเอียดของ Flow
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [submitting, setSubmitting] = useState(false); // สถานะกำลังส่งข้อมูล
  const [userFlowId, setUserFlowId] = useState(null); // เก็บ Flow ID ของผู้ใช้

  // ✅ ดึงค่า Flow ID จาก LocalStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.flow) {
      setUserFlowId(storedUser.flow);
    } else {
      setLoading(false); // ❌ ไม่มี Flow ให้หยุดโหลดเลย
    }
  }, []);

  // ✅ ดึงรายละเอียดของ Flow ตาม Flow ID ที่ได้จาก LocalStorage
  useEffect(() => {
    if (!userFlowId) return; // ❌ ถ้าไม่มี userFlowId หยุดทำงานทันที

    const fetchFlowDetails = async () => {
      try {
        const response = await axios.get(`${apiURL}approve-flows/${userFlowId}`);
        console.log("Fetched Flow Details:", response.data); // Debug Response
        setFlowDetails(response.data.flow);
      } catch (error) {
        console.error("Error fetching flow details:", error);
        setFlowDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowDetails();
  }, [userFlowId]);

  // ✅ Handle การยืนยัน Flow และส่งไปยัง `/api/approvals`
  const handleConfirm = async () => {
    if (!userFlowId) {
      alert("ไม่พบ Flow ที่เกี่ยวข้อง กรุณาตรวจสอบโปรไฟล์ของคุณ");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก LocalStorage

      // คัดเฉพาะ Level 2 ขึ้นไป
      const approvalHierarchy = flowDetails?.approvalHierarchy
        ?.filter((level) => level.level >= 2)
        .map((level) => ({
          level: level.level,
          approver: level.approver,
          status: "Pending",
        }));

      const payload = {
        quotationId,
        approvalHierarchy,
      };

      console.log("Submitting Approval Payload:", payload); // Debug Payload

      await axios.post(`${apiURL}approvals`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปใน Headers
          "Content-Type": "application/json",
        },
      });

      alert("Approve Flow assigned successfully!");
      navigate("/quotations"); // กลับไปหน้ารายการ Quotation
    } catch (error) {
      console.error("Error assigning approve flow:", error);
      alert("Failed to assign approve flow.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select Approve Flow</h1>
      <div className="bg-white shadow rounded p-6">
        {loading ? (
          <p className="text-gray-600">Loading approve flow details...</p>
        ) : !userFlowId ? ( // ❌ ถ้าไม่มี userFlowId แสดงข้อความ Error
          <p className="text-red-500">ไม่พบ Flow ที่เกี่ยวข้องกับบัญชีของคุณ</p>
        ) : flowDetails ? (
          <>
            <label className="block font-medium text-gray-700 mb-2">
              Approve Flow Selected
            </label>
            <input
              type="text"
              value={flowDetails.name}
              className="w-full border rounded px-3 py-2 bg-gray-200"
              disabled
            />

            {/* ✅ แสดง Approval Hierarchy */}
            {flowDetails.approvalHierarchy?.length > 0 ? (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <h2 className="text-lg font-bold mb-2">Approval Levels</h2>
                {flowDetails.approvalHierarchy.map((level, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <span className="font-medium">Level {level.level}:</span>
                    <input
                      type="text"
                      value={level.approver}
                      className="border px-3 py-2 w-full rounded bg-gray-200"
                      disabled
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No approval levels available</p>
            )}

            <div className="text-right mt-4">
              <button
                onClick={handleConfirm}
                className={`px-6 py-2 rounded text-white ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">ไม่พบ Flow ที่เกี่ยวข้องกับบัญชีของคุณ</p>
        )}
      </div>
    </div>
  );
};

export default RequestApproveFlow;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../config/config";

const RequestApproveFlow = () => {
  const navigate = useNavigate();
  const { quotationId } = useParams(); // รับ ID ของใบเสนอราคาที่พึ่งสร้าง
  const [flowDetails, setFlowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userFlowId, setUserFlowId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const isDeleted = useRef(false); // ✅ ใช้ป้องกันการลบซ้ำ

  // ✅ ฟังก์ชันลบใบ Quotation ล่าสุด
  const deleteLatestQuotation = useCallback(async () => {
    if (!quotationId || isDeleted.current) return; // หยุดถ้า Quotation ถูกลบไปแล้ว
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiURL}quotations/${quotationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Deleted quotation ID: ${quotationId}`);
      isDeleted.current = true; // ✅ ตั้งค่าว่าใบนี้ถูกลบแล้ว
    } catch (error) {
      console.error("Error deleting latest quotation:", error);
    }
  }, [quotationId]);

  // ✅ ดึงค่า Flow ID จาก LocalStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.flow) {
      setUserFlowId(storedUser.flow);
    } else {
      setLoading(false);
      setErrorMessage("ไม่พบ Flow ที่เกี่ยวข้องกับบัญชีของคุณ กรุณาติดต่อ Admin ที่ jakkit@optx.co.th");

      // ✅ ลบ Quotation เพียงครั้งเดียว
      if (!isDeleted.current) {
        deleteLatestQuotation();
      }
    }
  }, [deleteLatestQuotation]);

  // ✅ ดึงรายละเอียดของ Flow เฉพาะเมื่อมี userFlowId
  useEffect(() => {
    if (!userFlowId || isDeleted.current) return;

    const fetchFlowDetails = async () => {
      try {
        const response = await axios.get(`${apiURL}approve-flows/${userFlowId}`);
        console.log("Fetched Flow Details:", response.data);

        if (!response.data.flow) {
          throw new Error("Flow data is empty");
        }
        setFlowDetails(response.data.flow);
      } catch (error) {
        console.error("Error fetching flow details:", error);
        setFlowDetails(null);
        setErrorMessage("ไม่พบ Flow ที่เกี่ยวข้องกับบัญชีของคุณ กรุณาติดต่อ Admin ที่ jakkit@optx.co.th");

        // ✅ ลบ Quotation เพียงครั้งเดียว
        if (!isDeleted.current) {
          deleteLatestQuotation();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlowDetails();
  }, [userFlowId, deleteLatestQuotation]);

  // ✅ Handle การยืนยัน Flow และส่งไปยัง `/api/approvals`
  const handleConfirm = async () => {
    if (!userFlowId) {
      alert("ไม่พบ Flow ที่เกี่ยวข้อง กรุณาติดต่อ Admin ที่ jakkit@optx.co.th");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

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

      console.log("Submitting Approval Payload:", payload);

      await axios.post(`${apiURL}approvals`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Approve Flow assigned successfully!");
      navigate("/quotations");
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
        ) : errorMessage ? (
          <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
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

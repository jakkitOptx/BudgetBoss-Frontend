import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../config/config"; // Import API URL

const RequestApproveFlow = () => {
  const navigate = useNavigate();
  const { quotationId } = useParams(); // รับ ID ของใบเสนอราคาที่พึ่งสร้าง
  const [flows, setFlows] = useState([]); // เก็บ Approve Flow ทั้งหมด
  const [selectedFlowId, setSelectedFlowId] = useState(""); // เก็บ ID ของ Flow ที่เลือก
  const [flowDetails, setFlowDetails] = useState(null); // เก็บรายละเอียดของ Flow ที่เลือก
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [submitting, setSubmitting] = useState(false); // สถานะกำลังส่งข้อมูล

  // 🔹 ดึงรายการ Approve Flow ทั้งหมดจาก API
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await axios.get(`${apiURL}approve-flows/`);
        console.log("API Response:", response.data); // Debug Response
        
        if (response.data && Array.isArray(response.data.flows)) {
          setFlows(response.data.flows);
        } else if (Array.isArray(response.data)) {
          setFlows(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setFlows([]);
        }
      } catch (error) {
        console.error("Error fetching flows:", error);
        setFlows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlows();
  }, []);

  // 🔹 ดึงรายละเอียดของ Flow ที่เลือก
  useEffect(() => {
    if (selectedFlowId) {
      const fetchFlowDetails = async () => {
        try {
          const response = await axios.get(`${apiURL}approve-flows/${selectedFlowId}`);
          
          console.log("Fetched Flow Details:", response.data); // Debug Response
          
          setFlowDetails(response.data.flow); 
        } catch (error) {
          console.error("Error fetching flow details:", error);
          setFlowDetails(null);
        }
      };
      fetchFlowDetails();
    }
  }, [selectedFlowId]);

  // ✅ Handle การเลือก Flow
  const handleFlowChange = (e) => {
    setSelectedFlowId(e.target.value);
    setFlowDetails(null); // Reset รายละเอียดก่อนโหลดใหม่
  };

  // ✅ Handle การยืนยัน Flow และส่งไปยัง `/api/approvals`
  const handleConfirm = async () => {
    if (!selectedFlowId) {
      alert("กรุณาเลือก Approve Flow ก่อนยืนยัน");
      return;
    }
  
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก LocalStorage
  
      // คัดเฉพาะ Level 2 ขึ้นไป
      const approvalHierarchy = flowDetails.approvalHierarchy
        .filter(level => level.level >= 2)
        .map(level => ({
          level: level.level,
          approver: level.approver,
          status: "Pending"
        }));
  
      const payload = {
        quotationId,
        approvalHierarchy
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
          <p className="text-gray-600">Loading approve flows...</p>
        ) : (
          <>
            <label className="block font-medium text-gray-700 mb-2">
              Choose Approve Flow
            </label>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={selectedFlowId}
              onChange={handleFlowChange}
            >
              <option value="">-- Select Flow --</option>
              {flows.length > 0 ? (
                flows.map((flow) => (
                  <option key={flow._id} value={flow._id}>
                    {flow.name}
                  </option>
                ))
              ) : (
                <option disabled>No approve flows available</option>
              )}
            </select>

            {/* ✅ แสดง Approval Hierarchy */}
            {flowDetails && flowDetails.approvalHierarchy?.length > 0 ? (
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
                disabled={!selectedFlowId || submitting}
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestApproveFlow;

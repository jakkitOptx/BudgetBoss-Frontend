import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";
import ApprovalStatusBadge from "./ApprovalStatusBadge";
import ApprovalActionModal from "./ApprovalActionModal"; // ✅ Popup กรอกเหตุผล
import axios from "axios";
import { apiURL } from "../config/config";

const ApprovalTable = ({ quotations }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(""); // ✅ เก็บข้อความผิดพลาด

  // ✅ ฟังก์ชันดึงข้อมูล User
  const getUserData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return { email: user?.username || "", level: user?.level || 0 };
  };

  // ✅ เปิด Popup และกำหนดค่าที่เกี่ยวข้อง
  const openModal = (actionType, qt) => {
    setSelectedAction(actionType);
    setSelectedQuotation(qt);
    setReason(qt.reason || ""); // ✅ กรอกเหตุผลจากข้อมูลที่มีอยู่
    setIsModalOpen(true);
  };

  // ✅ ปิด Popup
  const closeModal = () => {
    setIsModalOpen(false);
    setReason("");
    setError(""); // ✅ เคลียร์ error เมื่อปิด Popup
  };

  // ✅ ฟังก์ชันอัปเดต Status (ยิง API)
  const updateApprovalStatus = async () => {
    if (!selectedQuotation) return;
    const { email, level } = getUserData();
    const token = localStorage.getItem("token");

    // ✅ หา ID ที่ถูกต้องจาก `approvalHierarchy`
    const approvalId = selectedQuotation.approvalHierarchy[0]?._id;
    if (!approvalId) {
      console.error("Approval ID not found in approvalHierarchy!");
      return;
    }

    // ✅ ถ้าเป็น Cancel ต้องมี reason
    if (selectedAction === "cancel" && !reason.trim()) {
      setError("กรุณากรอกเหตุผลในการยกเลิก");
      return;
    }

    try {
      await axios.patch(
        `${apiURL}approvals/${approvalId}/approvers`,
        {
          level,
          approver: email,
          status: selectedAction === "reject" ? "Rejected" : "Canceled",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ ยิง API อัปเดตเหตุผลแยกเฉพาะกรณี Reject / Cancel
      if (selectedAction === "reject" || selectedAction === "cancel") {
        await axios.patch(
          `${apiURL}quotations/${selectedQuotation._id}/reason`, // ✅ ใช้ `selectedQuotation._id`
          { reason },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error(`Error updating quotation:`, error);
      setError("เกิดข้อผิดพลาด ไม่สามารถอัปเดตสถานะได้");
    }
  };

  // ✅ ฟังก์ชันสำหรับ Approve (ไม่ต้องมีเหตุผล)
  const approveQuotation = async (qt) => {
    const { email, level } = getUserData();
    const token = localStorage.getItem("token");

    const approvalId = qt.approvalHierarchy[0]?._id;
    if (!approvalId) {
      console.error("Approval ID not found in approvalHierarchy!");
      return;
    }

    try {
      await axios.patch(
        `${apiURL}approvals/${approvalId}/approvers`,
        {
          level,
          approver: email,
          status: "Approved",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error(`Error approving quotation:`, error);
      setError("เกิดข้อผิดพลาด ไม่สามารถอนุมัติได้");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Run Number</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.length > 0 ? (
            quotations.map((qt) => (
              <tr key={qt._id} className="hover:bg-gray-100">
                <td className="p-2 border text-center">{qt.runNumber}</td>
                <td className="p-2 border">{qt.title}</td>
                <td className="p-2 border">{qt.client}</td>
                <td className="p-2 border">
                  {new Date(qt.documentDate).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <ApprovalStatusBadge status={qt.approvalStatus} />
                </td>
                <td className="p-2 border text-center flex gap-2 justify-center">
                  <button
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/quotation-details/${qt._id}`)}
                  >
                    <FaEye /> View
                  </button>

                  <button
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => approveQuotation(qt)}
                  >
                    <FaCheckCircle /> Approve
                  </button>

                  <button
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => openModal("reject", qt)}
                  >
                    <FaTimesCircle /> Reject
                  </button>

                  <button
                    className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    onClick={() => openModal("cancel", qt)}
                  >
                    <FaBan /> Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-600">
                No approval requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Popup สำหรับกรอกเหตุผล */}
      <ApprovalActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={updateApprovalStatus}
        actionType={selectedAction}
        reason={reason}
        setReason={setReason}
        error={error} // ✅ ส่ง error message ไปให้ Popup
      />
    </div>
  );
};

export default ApprovalTable;

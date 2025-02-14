import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";
import ApprovalStatusBadge from "./ApprovalStatusBadge";
import ApprovalActionModal from "./ApprovalActionModal";
import axios from "axios";
import { apiURL } from "../config/config";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  canApprove,
  canReject,
  canCancel,
  canEditDelete,
} from "../utils/buttonVisibility";

const ApprovalTable = ({ quotations }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return { email: user?.username || "", level: user?.level || 0 };
  };

  const { level } = getUserData();

  const openModal = (actionType, qt) => {
    setSelectedAction(actionType);
    setSelectedQuotation(qt);
    setReason(qt.reason || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReason("");
    setError("");
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

    if (selectedAction === "cancel" && !reason.trim()) {
      setError("กรุณากรอกเหตุผลในการยกเลิก");
      return;
    }

    try {
      setLoading(true);

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
          `${apiURL}quotations/${selectedQuotation._id}/reason`,
          { reason },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      toast.success("Status updated successfully ✅");
      closeModal();
      setTimeout(() => window.location.reload(), 1500); // ✅ Reload หลัง 1.5 วินาที
    } catch (error) {
      console.error(`Error updating quotation:`, error);
      toast.error("เกิดข้อผิดพลาด ไม่สามารถอัปเดตสถานะได้ ❌");
    } finally {
      // setLoading(false);
    }
  };

  const approveQuotation = async (qt) => {
    const { email, level } = getUserData();
    const token = localStorage.getItem("token");

    const approvalId = qt.approvalHierarchy[0]?._id;
    if (!approvalId) {
      console.error("Approval ID not found in approvalHierarchy!");
      return;
    }

    try {
      setLoading(true);

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

      toast.success("Quotation approved successfully ✅");
      setTimeout(() => window.location.reload(), 1500); // ✅ Reload หลัง 1.5 วินาที
    } catch (error) {
      console.error(`Error approving quotation:`, error);
      toast.error("เกิดข้อผิดพลาด ไม่สามารถอนุมัติได้ ❌");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <ClipLoader color="#ffffff" size={80} />
        </div>
      )}

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
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-2 justify-start">
                      {/* ปุ่ม View */}
                      <button
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => navigate(`/quotation-details/${qt._id}`)}
                      >
                        <FaEye /> View
                      </button>
                      {/* ปุ่ม Approve */}
                      {canEditDelete(qt.approvalStatus) && (
                        <>
                          {canApprove(qt.approvalStatus, level) && (
                            <button
                              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() => approveQuotation(qt)}
                              disabled={loading}
                            >
                              <FaCheckCircle /> Approve
                            </button>
                          )}
                          {/* ปุ่ม Reject */}
                          {canReject(qt.approvalStatus, level) && (
                            <button
                              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => openModal("reject", qt)}
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          )}
                          {/* ปุ่ม Cancel */}

                          {canCancel(qt.approvalStatus, level) && (
                            <button
                              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              onClick={() => openModal("cancel", qt)}
                            >
                              <FaBan /> Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
      </div>
      {/* ✅ Popup สำหรับกรอกเหตุผล */}
      <ApprovalActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={updateApprovalStatus}
        actionType={selectedAction}
        reason={reason}
        setReason={setReason}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default ApprovalTable;

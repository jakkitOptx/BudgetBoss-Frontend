import React, { useState } from "react";
import { ClipLoader } from "react-spinners"; // ✅ ใช้ react-spinners

const ApprovalActionModal = ({ isOpen, onClose, onConfirm, actionType, reason, setReason, loading }) => {
  const [error, setError] = useState(""); // ✅ State สำหรับเก็บข้อความผิดพลาด

  const handleConfirm = () => {
    // ✅ ตรวจสอบกรณี Cancel ต้องกรอกเหตุผล
    if (actionType === "cancel" && !reason.trim()) {
      setError("กรุณากรอกเหตุผลในการยกเลิก");
      return;
    }

    setError(""); // ✅ เคลียร์ข้อความผิดพลาด
    onConfirm(); // ✅ เรียกฟังก์ชันเพื่ออัปเดตสถานะ
  };

  if (!isOpen) return null; // ✅ ถ้า Popup ไม่เปิด ให้ซ่อน

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border border-gray-300 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {actionType === "reject" ? "Reject Quotation" : "Cancel Quotation"}
        </h2>

        {/* ✅ Textarea สำหรับกรอกเหตุผล */}
        <textarea
          className="w-full border border-gray-300 p-2 rounded mb-2"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading} // ✅ ปิด textarea ขณะโหลด
        />

        {/* ✅ แสดงข้อความผิดพลาดเป็นตัวอักษรสีแดง */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          {/* ปุ่ม Cancel */}
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={loading} // ✅ ปิดปุ่มระหว่างโหลด
          >
            Cancel
          </button>

          {/* ปุ่ม Confirm */}
          <button
            className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
            onClick={handleConfirm}
            disabled={loading} // ✅ ปิดปุ่มขณะโหลด
          >
            {loading ? <ClipLoader size={18} color="#ffffff" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalActionModal;

import React from "react";

const ApprovalActionModal = ({ isOpen, onClose, onConfirm, actionType, reason, setReason }) => {
  if (!isOpen) return null; // ถ้า Popup ไม่เปิด ให้ซ่อน

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border border-gray-300 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {actionType === "reject" ? "Reject Quotation" : "Cancel Quotation"}
        </h2>
        <textarea
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalActionModal;

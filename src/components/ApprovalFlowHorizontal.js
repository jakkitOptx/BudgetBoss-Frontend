import React from "react";
import { FaCheckCircle, FaRegClock, FaTimesCircle, FaBan } from "react-icons/fa";

const ApprovalFlowHorizontal = ({ approvalHierarchy }) => {
  console.log("approvalHierarchy ==>", approvalHierarchy);

  if (!approvalHierarchy || approvalHierarchy.length === 0) {
    return <p className="text-gray-500 text-center py-4">No approval flow available.</p>;
  }

  const extractedApprovalHierarchy =
    approvalHierarchy.length > 0 ? approvalHierarchy[0].approvalHierarchy : [];

  return (
    <div className="flex items-center justify-center w-full py-6 relative space-x-12">
      {extractedApprovalHierarchy.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative">
          {/* เส้น Timeline ระหว่างจุด Approve */}
          {index !== 0 && (
            <div className="absolute top-1/2 left-[-50%] w-full h-1 bg-gray-300 -z-10"></div>
          )}

          {/* Icon - เปลี่ยนสีตามสถานะ */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 bg-white shadow-md">
            {step.status === "Approved" ? (
              <FaCheckCircle className="text-green-500 text-3xl" />
            ) : step.status === "Rejected" ? (
              <FaTimesCircle className="text-red-500 text-3xl" />
            ) : step.status === "Canceled" ? (
              <FaBan className="text-gray-500 text-3xl" />
            ) : (
              <FaRegClock className="text-gray-400 text-3xl" />
            )}
          </div>

          {/* Approver Name */}
          <span className="mt-3 text-gray-700 font-semibold text-sm text-center w-28 truncate">
            {step.approver}
          </span>

          {/* Date หรือ Pending */}
          <span className="text-gray-500 text-xs">
            {step.date
              ? new Date(step.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })
              : "Pending"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ApprovalFlowHorizontal;

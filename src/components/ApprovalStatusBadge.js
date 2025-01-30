import React from "react";

const ApprovalStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-300 text-yellow-900";
      case "Approved":
        return "bg-green-300 text-green-900";
      case "Rejected":
        return "bg-red-300 text-red-900";
      default:
        return "bg-gray-300 text-gray-900";
    }
  };

  return <span className={`px-2 py-1 rounded text-xs ${getStatusClass(status)}`}>{status}</span>;
};

export default ApprovalStatusBadge;

import React from "react";

const QuotationTable = ({ quotations, sortConfig, handleSort, getSortIndicator }) => (
  <table className="w-full text-left">
    <thead>
      <tr>
        {["runNumber", "type", "title", "client", "documentDate", "approvalStatus", "netAmount"].map((key) => (
          <th
            key={key}
            className="border-b py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIndicator(key)}
          </th>
        ))}
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
);

export default QuotationTable;

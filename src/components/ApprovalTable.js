import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa"; // ✅ เพิ่มไอคอนจาก react-icons
import ApprovalStatusBadge from "./ApprovalStatusBadge";

const ApprovalTable = ({ quotations }) => {
  const navigate = useNavigate();

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
                  {/* ✅ ปุ่ม View พร้อมไอคอน */}
                  <button
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/quotation-details/${qt._id}`)}
                  >
                    <FaEye /> View
                  </button>

                  {/* ✅ ปุ่ม Approve พร้อมไอคอน */}
                  <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    <FaCheckCircle /> Approve
                  </button>

                  {/* ✅ ปุ่ม Reject พร้อมไอคอน */}
                  <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    <FaTimesCircle /> Reject
                  </button>

                  {/* ✅ ปุ่ม Cancel พร้อมไอคอน */}
                  <button className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
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
    </div>
  );
};

export default ApprovalTable;

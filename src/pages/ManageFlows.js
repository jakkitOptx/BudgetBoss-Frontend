import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageFlows = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const navigate = useNavigate();

  // ดึงข้อมูล Approve Flows
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approve-flows");
        setFlows(response.data.flows || []);
      } catch (error) {
        console.error("Error fetching flows:", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล Flows", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  // Handle การลบ Flow
  const handleDelete = async (flowId) => {
    if (window.confirm("คุณต้องการลบ Flow นี้หรือไม่?")) {
      try {
        await axios.delete(`http://localhost:5000/api/approve-flows/delete/${flowId}`);
        setFlows(flows.filter((flow) => flow._id !== flowId));
        toast.success("ลบ Flow สำเร็จ!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error deleting flow:", error);
        toast.error("เกิดข้อผิดพลาดในการลบ Flow", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Handle เปิด Modal ดูรายละเอียด
  const handleView = (flow) => {
    setSelectedFlow(flow);
  };

  // Handle ปิด Modal
  const closeModal = () => {
    setSelectedFlow(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Approve Flows</h1>
      {flows.length === 0 ? (
        <p className="text-gray-600">ยังไม่มี Flow ที่สร้าง</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm tracking-wide uppercase">#</th>
                <th className="px-6 py-3 font-semibold text-sm tracking-wide uppercase">Flow Name</th>
                <th className="px-6 py-3 font-semibold text-sm tracking-wide text-center uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {flows.map((flow, index) => (
                <tr
                  key={flow._id}
                  className="hover:bg-gray-100 transition-all duration-200 ease-in-out"
                >
                  <td className="px-6 py-3 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-3 text-gray-700">{flow.name}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all duration-200"
                      onClick={() => handleView(flow)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-200"
                      onClick={() => navigate(`/edit-flow/${flow._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
                      onClick={() => handleDelete(flow._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal แสดงรายละเอียด Flow */}
      {selectedFlow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Flow Details</h2>
            <p className="text-gray-700">
              <strong>Name:</strong> {selectedFlow.name}
            </p>
            <h3 className="text-lg font-semibold mt-3">Approval Hierarchy:</h3>
            <ul className="list-disc list-inside">
              {selectedFlow.approvalHierarchy.map((level) => (
                <li key={level.level}>
                  <strong>Level {level.level}:</strong> {level.approver}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default ManageFlows;

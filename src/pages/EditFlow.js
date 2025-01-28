import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiURL } from "../config/config"; // Import API URL

const EditFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flowName, setFlowName] = useState("");
  const [levels, setLevels] = useState([]);

  // ดึงข้อมูล Flow ที่ต้องแก้ไข
  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await axios.get(`${apiURL}approve-flows/${id}`);
        const flowData = response.data.flow;
        setFlowName(flowData.name);
        setLevels(flowData.approvalHierarchy || []);
      } catch (error) {
        console.error("Error fetching flow:", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล Flow", { position: "top-right", autoClose: 3000 });
      }
    };

    fetchFlow();
  }, [id]);

  // Handle เพิ่ม Level ใหม่
  const addLevel = () => {
    setLevels([...levels, { level: levels.length + 1, approver: "" }]);
  };

  // Handle ลบ Level
  const removeLevel = (index) => {
    const updatedLevels = levels.filter((_, i) => i !== index);
    setLevels(updatedLevels);
  };

  // Handle เปลี่ยนค่าของ Level
  const handleLevelChange = (index, value) => {
    const updatedLevels = [...levels];
    updatedLevels[index].approver = value;
    setLevels(updatedLevels);
  };

  // Handle อัปเดตข้อมูล
  const handleUpdate = async (e) => {
    e.preventDefault();

    // ตรวจสอบอีเมลว่าถูกต้องไหม
    const hasInvalidEmail = levels.some((level) => !/\S+@\S+\.\S+/.test(level.approver));
    if (!flowName || hasInvalidEmail) {
      toast.error("กรุณากรอกชื่อ Flow และอีเมลให้ถูกต้อง!", { position: "top-right", autoClose: 3000 });
      return;
    }

    const payload = {
      name: flowName,
      approvalHierarchy: levels.map((level, index) => ({
        level: index + 1,
        approver: level.approver,
      })),
    };

    try {
      await axios.put(`${apiURL}approve-flows/update/${id}`, payload); 
      toast.success("อัปเดต Flow สำเร็จ!", { position: "top-right", autoClose: 3000 });
      navigate("/manage-flows"); 
    } catch (error) {
      console.error("Error updating flow:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดต Flow", { position: "top-right", autoClose: 3000 });
    }
  };

  // Handle ลบ Flow
  const handleDelete = async () => {
    if (window.confirm("คุณต้องการลบ Flow นี้หรือไม่?")) {
      try {
        await axios.delete(`${apiURL}approve-flows/delete/${id}`);
        toast.success("ลบ Flow สำเร็จ!", { position: "top-right", autoClose: 3000 });
        navigate("/manage-flows");
      } catch (error) {
        console.error("Error deleting flow:", error);
        toast.error("เกิดข้อผิดพลาดในการลบ Flow", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Edit Approve Flow</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded shadow-md border border-gray-200">
        {/* Input ชื่อ Flow */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Flow Name</label>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter flow name"
          />
        </div>

        {/* รายการ Approval Levels */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Approval Levels</label>
          {levels.map((level, index) => (
            <div key={index} className="flex items-center space-x-4 mb-3 bg-gray-100 p-3 rounded shadow">
              <span className="font-medium text-gray-600">Level {index + 1}</span>
              <input
                type="email"
                value={level.approver}
                onChange={(e) => handleLevelChange(index, e.target.value)}
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Approver email"
              />
              <button
                type="button"
                onClick={() => removeLevel(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
                disabled={levels.length === 1} 
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ปุ่มเพิ่ม Level */}
        <button
          type="button"
          onClick={addLevel}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
        >
          Add Level
        </button>

        {/* ปุ่ม Submit & Delete */}
        <div className="flex space-x-4">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-200">
            Update Flow
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200"
          >
            Delete Flow
          </button>
        </div>
      </form>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default EditFlow;

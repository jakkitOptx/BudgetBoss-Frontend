import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveFlow = () => {
  const [flowName, setFlowName] = useState("");
  const [levels, setLevels] = useState([
    { level: 1, email: "" } // เริ่มต้นด้วย 1 level
  ]);

  // Handle การเพิ่ม Level
  const addLevel = () => {
    setLevels([...levels, { level: levels.length + 1, email: "" }]);
  };

  // Handle การลบ Level
  const removeLevel = (index) => {
    const updatedLevels = levels.filter((_, i) => i !== index);
    setLevels(updatedLevels);
  };

  // Handle การเปลี่ยนค่าใน Level
  const handleLevelChange = (index, value) => {
    const updatedLevels = [...levels];
    updatedLevels[index].email = value;
    setLevels(updatedLevels);
  };

  // Handle การส่งข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: ตรวจสอบอีเมล
    const hasInvalidEmail = levels.some((level) => !/\S+@\S+\.\S+/.test(level.email));
    if (!flowName || hasInvalidEmail) {
      toast.error("กรุณากรอกชื่อ Flow และอีเมลให้ถูกต้อง!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // สร้าง payload
    const payload = {
      name: flowName, // เปลี่ยน flowName เป็น name
      approvalHierarchy: levels.map((level) => ({
        level: level.level,
        approver: level.email
      }))
    };

    try {
      const response = await axios.post("http://localhost:5000/api/approve-flows/create", payload);
      toast.success("สร้าง Approve Flow สำเร็จ!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log(response.data);
      // Reset ฟอร์มหลังจากส่งสำเร็จ
      setFlowName("");
      setLevels([{ level: 1, email: "" }]);
    } catch (error) {
      console.error("Error creating approve flow:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง Approve Flow", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-600">
        Create Approve Flow
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
      >
        {/* Input สำหรับชื่อ Flow */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Flow Name</label>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter flow name"
          />
        </div>

        {/* Dynamic Levels */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Approval Levels</label>
          {levels.map((level, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 mb-3 bg-gray-100 p-3 rounded shadow"
            >
              <span className="font-medium text-gray-600">Level {level.level}</span>
              <input
                type="email"
                value={level.email}
                onChange={(e) => handleLevelChange(index, e.target.value)}
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Approver email"
              />
              <button
                type="button"
                onClick={() => removeLevel(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                disabled={levels.length === 1} // ห้ามลบถ้าเหลือ 1 level
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
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
        >
          Add Level
        </button>

        {/* ปุ่ม Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-all"
          >
            Create Flow
          </button>
        </div>
      </form>

      {/* React Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default ApproveFlow;

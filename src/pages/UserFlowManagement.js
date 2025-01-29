import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiURL } from "../config/config"; // ✅ ใช้ API URL จาก Config

const UserFlowManagement = () => {
  const [users, setUsers] = useState([]); // รายชื่อพนักงาน
  const [flows, setFlows] = useState([]); // รายการ Flow ทั้งหมด
  const [updatedUsers, setUpdatedUsers] = useState({}); // เก็บ user ที่ถูกแก้ไข
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ ดึงข้อมูล Users และ Flows
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${apiURL}users`);
        const flowsResponse = await axios.get(`${apiURL}approve-flows`);
        setUsers(usersResponse.data);
        setFlows(flowsResponse.data.flows || flowsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ หา Flow Name ตาม Flow ID
  const getFlowName = (flowId) => {
    if (!flowId) return "";
    const flow = flows.find((f) => f._id === flowId);
    return flow ? flow.name : "Unknown Flow";
  };

  // ✅ Handle เปลี่ยน Flow ของ User
  const handleFlowChange = (userId, flowId) => {
    setUpdatedUsers((prev) => ({
      ...prev,
      [userId]: flowId,
    }));
  };

  // ✅ บันทึกเฉพาะ User ที่มีการเปลี่ยนแปลง และอัปเดต users ทันที
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      // อัปเดตเฉพาะ User ที่มีการเปลี่ยนแปลง
      const updateRequests = Object.entries(updatedUsers).map(
        async ([userId, flowId]) => {
          await axios.patch(
            `${apiURL}users/${userId}`,  // ✅ เอา `/` ออก
            { flow: flowId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      );

      await Promise.all(updateRequests);

      // ✅ อัปเดต State users โดยไม่ต้อง Refresh
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          updatedUsers[user._id]
            ? { ...user, flow: updatedUsers[user._id] }
            : user
        )
      );

      alert("อัปเดต Flow สำเร็จ!");
      setUpdatedUsers({}); // ✅ เคลียร์ updatedUsers
    } catch (error) {
      console.error("Error updating users:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Flow Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full">
          <div className="border rounded-lg bg-white shadow-md p-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="flex justify-between items-center border-b py-4 px-6"
              >
                {/* ✅ เพิ่มลำดับที่หน้าชื่อ */}
                <span className="font-bold text-gray-800">
                  {index + 1}. {user.firstName} {user.lastName}
                </span>
                <select
                  className="border px-4 py-2 rounded text-gray-700 w-1/3"
                  value={updatedUsers[user._id] || user.flow || ""}
                  onChange={(e) => handleFlowChange(user._id, e.target.value)}
                >
                  <option value="">
                    {user.flow ? getFlowName(user.flow) : "-- Select Flow --"}
                  </option>
                  {flows.map((flow) => (
                    <option key={flow._id} value={flow._id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ✅ ปุ่ม Save อยู่ขวาล่าง */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default UserFlowManagement;

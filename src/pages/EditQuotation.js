import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditQuotation = () => {
  const { id } = useParams(); // ดึง `id` จาก URL Parameter
  const navigate = useNavigate(); // ใช้สำหรับ Redirect
  const [quotation, setQuotation] = useState(null); // เก็บข้อมูล Quotation
  const [loading, setLoading] = useState(true); // สถานะ Loading
  const [error, setError] = useState(""); // ข้อผิดพลาด

  // ดึงข้อมูล Quotation จาก API
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/quotations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuotation(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quotation:", err);
        setError("Failed to load quotation details.");
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  // ฟังก์ชันสำหรับอัปเดต Quotation
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/quotations/${id}`, quotation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Quotation updated successfully!");
      navigate("/quotations");
    } catch (err) {
      console.error("Error updating quotation:", err);
      alert("Failed to update quotation.");
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยนแปลงค่าฟิลด์
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuotation({ ...quotation, [name]: value });
  };

  if (loading) {
    return <p className="text-center mt-4 text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Quotation</h1>

      {/* ฟอร์มแก้ไข Quotation */}
      <form onSubmit={handleUpdate} className="bg-white shadow rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={quotation.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Client</label>
          <input
            type="text"
            name="client"
            value={quotation.client || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={quotation.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={quotation.description || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/quotations")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuotation;

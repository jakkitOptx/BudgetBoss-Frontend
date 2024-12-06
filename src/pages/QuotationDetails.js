import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuotationDetails = () => {
  const { id } = useParams(); // ดึง `id` จาก URL Parameter
  const [quotation, setQuotation] = useState(null); // เก็บข้อมูล Quotation
  const [loading, setLoading] = useState(true); // สถานะ Loading

  // ดึงข้อมูลใบเสนอราคาจาก API
  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
        const response = await axios.get(
          `http://localhost:5000/api/quotations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
            },
          }
        );
        setQuotation(response.data); // เก็บข้อมูลที่ได้
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotation details:", error);
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [id]);

  // หากกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // หากไม่มีข้อมูล (กรณี ID ไม่ถูกต้อง)
  if (!quotation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Quotation not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Quotation Details
      </h1>

      {/* ข้อมูลพื้นฐาน */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <span className="font-bold">Title:</span> {quotation.title}
          </p>
          <p>
            <span className="font-bold">Client:</span>{" "}
            {quotation.client || "N/A"}
          </p>
          <p>
            <span className="font-bold">Sale Person:</span>{" "}
            {quotation.salePerson}
          </p>
          <p>
            <span className="font-bold">Document Date:</span>{" "}
            {new Date(quotation.documentDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-bold">Product Name:</span>{" "}
            {quotation.productName}
          </p>
          <p>
            <span className="font-bold">Project Name:</span>{" "}
            {quotation.projectName}
          </p>
          <p>
            <span className="font-bold">Period:</span> {quotation.period}
          </p>
          <p>
            <span className="font-bold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                quotation.approvalStatus === "Approved"
                  ? "bg-green-100 text-green-700"
                  : quotation.approvalStatus === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : quotation.approvalStatus === "Rejected" ||
                    quotation.approvalStatus === "Canceled"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {quotation.approvalStatus}
            </span>
          </p>
        </div>
      </div>

      {/* รายการสินค้า/บริการ */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
        {quotation.items && quotation.items.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2 text-left">Description</th>
                <th className="border-b py-2 text-left">Unit</th>
                <th className="border-b py-2 text-left">Unit Price</th>
                <th className="border-b py-2 text-left">Amount (THB)</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.unit}</td>
                  <td className="py-2">{item.unitPrice || "-"}</td>
                  <td className="py-2">
                    {item.amount.toLocaleString("th-TH", {
                      style: "currency",
                      currency: "THB",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No items available.</p>
        )}
      </div>

      {/* สรุปยอดเงิน */}
      <div className="bg-gray-50 shadow rounded p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
        <div className="flex flex-col space-y-2">
          <p className="flex justify-between">
            <span className="font-bold">Total Before Fee:</span>
            <span>
              {quotation.totalBeforeFee.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Fee ({quotation.fee}%):</span>
            <span>
              {quotation.calFee.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Total:</span>
            <span>
              {quotation.total.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Discount:</span>
            <span>
              {quotation.discount.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Amount Before Tax:</span>
            <span>
              {quotation.amountBeforeTax.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">VAT (7%):</span>
            <span>
              {quotation.vat.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Net Amount:</span>
            <span>
              {quotation.netAmount.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;

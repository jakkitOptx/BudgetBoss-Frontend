import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateQuotationForm = ({
  quotationData,
  setQuotationData,
  handleChange,
  handleClientChange
}) => {
  const [clients, setClients] = useState([]); // state สำหรับเก็บข้อมูลลูกค้า
  const [loadingClients, setLoadingClients] = useState(false); // state สำหรับโหลดข้อมูลลูกค้า

  // ดึงข้อมูลลูกค้าจาก API
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data); // บันทึกข้อมูลลูกค้าใน state
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Title */}
      <div>
        <label className="block mb-1 text-gray-600">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={quotationData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Client */}
      <div>
        <label className="block mb-1 text-gray-600">Client</label>
        {loadingClients ? (
          <p>Loading clients...</p>
        ) : (
          <select
            name="clientId"
            value={quotationData.clientId || ""}
            onChange={(e) => {
              const selectedClient = clients.find(
                (client) => client._id === e.target.value
              );
              handleClientChange(
                selectedClient?._id,
                selectedClient?.customerName
              ); // ส่งค่า clientId และ clientName กลับไป
            }}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.customerName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Sale Person */}
      <div>
        <label className="block mb-1 text-gray-600">Sale Person</label>
        <input
          type="text"
          name="salePerson"
          placeholder="Enter sale person name"
          value={quotationData.salePerson}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Document Date */}
      <div>
        <label className="block mb-1 text-gray-600">Document Date</label>
        <input
          type="date"
          name="documentDate"
          value={quotationData.documentDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Product Name */}
      <div>
        <label className="block mb-1 text-gray-600">Product Name</label>
        <input
          type="text"
          name="productName"
          placeholder="Enter product name"
          value={quotationData.productName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Project Name */}
      <div>
        <label className="block mb-1 text-gray-600">Project Name</label>
        <input
          type="text"
          name="projectName"
          placeholder="Enter project name"
          value={quotationData.projectName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Period */}
      <div>
        <label className="block mb-1 text-gray-600">Period</label>
        <input
          type="text"
          name="period"
          placeholder="e.g., NOV 2024 - DEC 2024"
          value={quotationData.period}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      {/* Start Date and End Date */}
      <div className="md:col-span-2 flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={quotationData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={quotationData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Type and Fee */}
      <div className="md:col-span-2 flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">Type</label>
          <select
            name="type"
            value={quotationData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="M">M</option>
            <option value="S">S</option>
            <option value="W">W</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">Fee</label>
          <div className="relative">
            <input
              type="number"
              name="fee"
              placeholder="Enter fee"
              value={quotationData.fee}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setQuotationData({
                  ...quotationData,
                  fee: value < 0 ? 0 : value, // ห้ามค่าติดลบ
                });
              }}
              className="w-full px-4 py-2 border rounded pr-10"
              required
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              %
            </span>
          </div>
        </div>
      </div>
      {/* Create By and Proposed By */}
      <div className="md:col-span-2 flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">Create By</label>
          <input
            type="text"
            name="createBy"
            placeholder="Enter creator name"
            value={quotationData.createBy}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-600">Proposed By</label>
          <input
            type="text"
            name="proposedBy"
            placeholder="Enter proposer name"
            value={quotationData.proposedBy}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
      </div>
      {/* Discount, CreditTerm, and Remark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Discount */}
        <div>
          <label className="block mb-1 text-gray-600">Discount</label>
          <input
            type="number"
            name="discount"
            placeholder="Enter discount"
            value={quotationData.discount || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* CreditTerm */}
        <div>
          <label className="block mb-1 text-gray-600">Credit Term</label>
          <input
            type="number"
            name="CreditTerm"
            placeholder="Enter credit term (days)"
            value={quotationData.CreditTerm || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Remark */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-gray-600">Remark</label>
          <textarea
            name="remark"
            placeholder="Enter remarks"
            value={quotationData.remark || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded h-24"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuotationForm;

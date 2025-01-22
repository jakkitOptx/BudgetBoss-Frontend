import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateQuotationForm from "../components/CreateQuotationForm";
import ItemsForm from "../components/ItemsForm";
import QuotationPreview from "../components/QuotationPreview";
import { pdf } from "@react-pdf/renderer"; // สำหรับการสร้าง Blob
import bankAccounts from "../data/bankAccounts.json"; // โหลดข้อมูลธนาคาร
import { apiURL } from "../config/config"



const CreateQuotation = () => {
  const navigate = useNavigate();

  const [quotationData, setQuotationData] = useState({
    title: "",
    client: "",
    clientId : "",
    salePerson: "",
    documentDate: "",
    productName: "",
    projectName: "",
    period: "",
    startDate: "",
    endDate: "",
    createBy: "",
    proposedBy: "",
    type: "M",
    fee: 0,
    items: [],
    discount: 0,
    createdByUser: "",
    totalBeforeFee: 0,
    netAmount: 0,
    remark: "", // เพิ่มฟิลด์ remark ตรงนี้
  });

  const [item, setItem] = useState({
    description: "",
    unit: 1,
    unitPrice: "",
  });

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setQuotationData((prev) => ({
        ...prev,
        createdByUser: user.username,
      }));
    }
  }, []);

  // คำนวณ Total และ Net Amount
  useEffect(() => {
    const totalBeforeFee = quotationData.items.reduce(
      (sum, itm) => sum + itm.unit * itm.unitPrice,
      0
    );
    const netAmount =
      totalBeforeFee -
      quotationData.discount +
      totalBeforeFee * (quotationData.fee / 100);
    setQuotationData((prev) => ({ ...prev, totalBeforeFee, netAmount }));
  }, [quotationData.items, quotationData.discount, quotationData.fee]);

  const handleItemChange = (field, value) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (!item.description || !item.unit || !item.unitPrice) {
      alert("Please fill in all item fields.");
      return;
    }
    setQuotationData((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
    setItem({ description: "", unit: 1, unitPrice: "" });
  };

  const removeItem = (index) => {
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, updatedItem) => {
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.map((itm, i) => (i === index ? updatedItem : itm)),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuotationData((prev) => ({
      ...prev,
      [name]:
        name === "discount" || name === "fee" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${apiURL}quotations`, quotationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Quotation created successfully!");
      navigate("/quotations");
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Failed to create quotation.");
    }
  };

  const handlePreview = async () => {
    console.log("quotationData Create ==>", quotationData);

    // ดึงข้อมูลธนาคารจาก JSON ตาม company
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const company = user.company || "";
    const bankInfo = bankAccounts.companies[company] || {};
  
    try {
      // ตรวจสอบว่า clientId มีค่าหรือไม่
      if (!quotationData.clientId) {
        alert("Please select a client before previewing.");
        return;
      }
  
      // คำนวณข้อมูลล่าสุดก่อน Preview
      const totalBeforeFee = quotationData.items.reduce(
        (sum, itm) => sum + itm.unit * itm.unitPrice,
        0
      );
      const feeAmount = totalBeforeFee * (quotationData.fee / 100);
      const totalAfterFee = totalBeforeFee + feeAmount;
      const amountBeforeTax = totalAfterFee - quotationData.discount;
      const vat = amountBeforeTax * 0.07; // คำนวณ VAT 7%
      const netAmount = amountBeforeTax + vat;
  
      // ดึงข้อมูลลูกค้าจาก API
      const clientResponse = await axios.get(
        `${apiURL}clients/${quotationData.clientId}`
      );
      const clientDetails = clientResponse.data;
  
      // อัปเดตข้อมูลทั้งหมด
      const updatedQuotationData = {
        ...quotationData,
        totalBeforeFee,
        feeAmount,
        total: totalAfterFee,
        amountBeforeTax,
        vat,
        netAmount,
        clientDetails, // รวมข้อมูลลูกค้าเข้าไปด้วย
      };
  
      // แสดง Preview ด้วยข้อมูลที่คำนวณใหม่
      const blob = await pdf(
        <QuotationPreview quotationData={updatedQuotationData} bankInfo={bankInfo} />
      ).toBlob();
  
      const url = URL.createObjectURL(blob);
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(
          `<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`
        );
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      alert("Failed to generate preview.");
    }
  };

  const handleClientChange = (clientId, clientName) => {
    setQuotationData((prev) => ({
      ...prev,
      clientId,
      client: clientName,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Quotation</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6">
        <CreateQuotationForm
          quotationData={quotationData}
          handleChange={handleChange}
          setQuotationData={setQuotationData}
          handleClientChange={handleClientChange}
        />
        <ItemsForm
          items={quotationData.items}
          item={item}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />
        <div className="flex justify-end mt-4 space-x-4">
          <button
            type="button"
            onClick={handlePreview}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Preview
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotation;

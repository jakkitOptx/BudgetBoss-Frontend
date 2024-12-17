import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateQuotationForm from "../components/CreateQuotationForm";
import ItemsForm from "../components/ItemsForm";
import QuotationPreview from "../components/QuotationPreview";
import { pdf } from "@react-pdf/renderer"; // สำหรับการสร้าง Blob

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quotationData, setQuotationData] = useState({
    title: "",
    client: "",
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

  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล Quotation จาก API
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/quotations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        // แปลงวันที่ให้เป็น yyyy-MM-dd
        const formatDate = (isoDate) => (isoDate ? isoDate.split("T")[0] : "");

        setQuotationData({
          ...data,
          documentDate: formatDate(data.documentDate),
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          netAmount: data.netAmount || 0,
          totalBeforeFee: data.totalBeforeFee || 0,
          items: data.items || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching quotation:", err);
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

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

    const calculatedAmount = item.unit * parseFloat(item.unitPrice);
    setQuotationData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { ...item, amount: calculatedAmount || 0 }, // เพิ่มการคำนวณ amount
      ],
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
    const calculatedAmount =
      updatedItem.unit * parseFloat(updatedItem.unitPrice || 0);
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.map((itm, i) =>
        i === index ? { ...updatedItem, amount: calculatedAmount } : itm
      ),
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const toISOString = (dateString) =>
      dateString ? new Date(dateString).toISOString() : null;

    const updatedQuotationData = {
      ...quotationData,
      documentDate: toISOString(quotationData.documentDate),
      startDate: toISOString(quotationData.startDate),
      endDate: toISOString(quotationData.endDate),
      items: quotationData.items.map((item) => ({
        ...item,
        amount: item.unit * parseFloat(item.unitPrice || 0),
      })),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/quotations/${id}`,
        updatedQuotationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Quotation updated successfully!");
      navigate("/quotations");
    } catch (err) {
      console.error("Error updating quotation:", err);
      alert("Failed to update quotation.");
    }
  };

  const handlePreview = async () => {
    const totalBeforeFee = quotationData.items.reduce(
      (sum, itm) => sum + (itm.unit || 0) * (parseFloat(itm.unitPrice) || 0),
      0
    );
  
    const feeAmount = (totalBeforeFee * (quotationData.fee / 100)).toFixed(2); // ตัดทศนิยม 2 ตำแหน่ง
    const discount = quotationData.discount || 0;
    const amountBeforeTax = (totalBeforeFee + parseFloat(feeAmount) - discount).toFixed(2); // ตัดทศนิยม 2 ตำแหน่ง
    const vat = (amountBeforeTax * 0.07).toFixed(2); // คำนวณ VAT และตัดทศนิยม 2 ตำแหน่ง
    const netAmount = (parseFloat(amountBeforeTax) + parseFloat(vat)).toFixed(2);
  
    const updatedQuotationData = {
      ...quotationData,
      totalBeforeFee: parseFloat(totalBeforeFee.toFixed(2)), // ตัดทศนิยม 2 ตำแหน่ง
      amountBeforeTax: parseFloat(amountBeforeTax),
      vat: parseFloat(vat),
      netAmount: parseFloat(netAmount),
    };
  
    const blob = await pdf(
      <QuotationPreview quotationData={updatedQuotationData} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
  
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        `<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`
      );
    }
  };
  

  if (loading) {
    return <p className="text-center mt-4 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Quotation</h1>
      <form onSubmit={handleUpdate} className="bg-white shadow rounded p-6">
        <CreateQuotationForm
          quotationData={quotationData}
          handleChange={handleChange}
          setQuotationData={setQuotationData}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuotation;

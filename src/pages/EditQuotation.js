import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateQuotationForm from "../components/CreateQuotationForm";
import ItemsForm from "../components/ItemsForm";
import QuotationPreview from "../components/QuotationPreview";
import { pdf } from "@react-pdf/renderer"; // สำหรับการสร้าง Blob
import bankAccounts from "../data/bankAccounts.json"; // โหลดข้อมูลธนาคาร

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
    remark: "",
  });

  const [item, setItem] = useState({
    description: "",
    unit: 1,
    unitPrice: "",
  });

  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลจาก API
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
  
        const formatDate = (isoDate) => (isoDate ? isoDate.split("T")[0] : "");
        setQuotationData({
          ...data,
          clientId: data.clientId || "", // ดึง clientId จาก API
          client: data.client || "", // ดึง client name จาก API
          documentDate: formatDate(data.documentDate),
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          items: data.items || [],
          totalBeforeFee: data.totalBeforeFee || 0,
          netAmount: data.netAmount || 0,
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
      totalBeforeFee - quotationData.discount + totalBeforeFee * (quotationData.fee / 100);

    setQuotationData((prev) => ({
      ...prev,
      totalBeforeFee: parseFloat(totalBeforeFee.toFixed(2)),
      netAmount: parseFloat(netAmount.toFixed(2)),
    }));
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
        { ...item, amount: calculatedAmount || 0 },
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
    const calculatedAmount = updatedItem.unit * parseFloat(updatedItem.unitPrice || 0);
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
    console.log("quotationData => " , quotationData)
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const company = user.company || "";
      const bankInfo = bankAccounts.companies[company] || {};
  
      const totalBeforeFee = quotationData.items.reduce(
        (sum, itm) => sum + (itm.unit || 0) * (parseFloat(itm.unitPrice) || 0),
        0
      );
      const feeAmount = (totalBeforeFee * (quotationData.fee / 100)).toFixed(2);
      const discount = quotationData.discount || 0;
      const amountBeforeTax = (totalBeforeFee + parseFloat(feeAmount) - discount).toFixed(2);
      const vat = (amountBeforeTax * 0.07).toFixed(2);
      const netAmount = (parseFloat(amountBeforeTax) + parseFloat(vat)).toFixed(2);
  
      if (!quotationData.clientId) {
        alert("Please select a client before previewing.");
        return;
      }
  
      const clientResponse = await axios.get(
        `http://localhost:5000/api/clients/${quotationData.clientId._id}`
      );
      const clientDetails = clientResponse.data;
  
      const updatedQuotationData = {
        ...quotationData,
        totalBeforeFee: parseFloat(totalBeforeFee.toFixed(2)),
        amountBeforeTax: parseFloat(amountBeforeTax),
        vat: parseFloat(vat),
        netAmount: parseFloat(netAmount),
        clientDetails, // รวม clientDetails
      };
  
      const blob = await pdf(
        <QuotationPreview quotationData={updatedQuotationData} bankInfo={bankInfo} />
      ).toBlob();
  
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
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
  
  if (loading) return <p className="text-center mt-4 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Quotation</h1>
      <form onSubmit={handleUpdate} className="bg-white shadow rounded p-6">
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuotation;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateQuotationForm from "../components/CreateQuotationForm";
import ItemsForm from "../components/ItemsForm";

const CreateQuotation = () => {
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
  });
  

  const [item, setItem] = useState({
    description: "",
    unit: 1,
    unitPrice: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuotationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/quotations", quotationData, {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Quotation</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6">
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
        />
        <div className="flex justify-end mt-4">
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

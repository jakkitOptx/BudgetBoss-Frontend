import React, { useState } from "react";

const ItemsForm = ({
  items,
  item,
  handleItemChange,
  addItem,
  removeItem,
  updateItem,
}) => {
  const [editingIndex, setEditingIndex] = useState(null); // เก็บ Index ที่กำลังแก้ไข

  const startEditing = (index) => {
    setEditingIndex(index);
    const itm = items[index];
    handleItemChange("description", itm.description);
    handleItemChange("unit", itm.unit);
    handleItemChange("unitPrice", itm.unitPrice);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      updateItem(editingIndex, item);
      setEditingIndex(null);
      handleItemChange("description", "");
      handleItemChange("unit", 1);
      handleItemChange("unitPrice", "");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Items</h2>

      {/* แสดง Table ของ Items */}
      {items.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border py-2 px-4 text-left">Description</th>
                <th className="border py-2 px-4 text-right">Units</th>
                <th className="border py-2 px-4 text-right">Unit Price (THB)</th>
                <th className="border py-2 px-4 text-right">Amount (THB)</th>
                <th className="border py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((itm, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border py-2 px-4">{itm.description}</td>
                  <td className="border py-2 px-4 text-right">{itm.unit}</td>
                  <td className="border py-2 px-4 text-right">
                    {parseFloat(itm.unitPrice).toLocaleString("th-TH")}
                  </td>
                  <td className="border py-2 px-4 text-right">
                    {(itm.unit * itm.unitPrice).toLocaleString("th-TH")}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    <button
                      type="button" // ป้องกันการ submit ฟอร์ม
                      onClick={() => startEditing(index)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button" // ป้องกันการ submit ฟอร์ม
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form สำหรับเพิ่มหรือแก้ไข Item */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          name="description"
          placeholder="Item Description"
          value={item.description}
          onChange={(e) => handleItemChange("description", e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
        <input
          type="number"
          name="unit"
          placeholder="Units"
          value={item.unit}
          onChange={(e) => handleItemChange("unit", e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="unitPrice"
          placeholder="Unit Price"
          value={item.unitPrice}
          onChange={(e) => handleItemChange("unitPrice", e.target.value)}
          className="px-4 py-2 border rounded"
        />
        {editingIndex !== null ? (
          <button
            type="button" // ป้องกันการ submit ฟอร์ม
            onClick={saveEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            type="button" // ป้องกันการ submit ฟอร์ม
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemsForm;

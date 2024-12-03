import React from "react";

const ItemsForm = ({ items, item, handleItemChange, addItem, removeItem }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">Items</h2>
      {items.length > 0 && (
        <ul className="mb-4">
          {items.map((itm, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>
                {itm.description} - {itm.unit} units @ {itm.unitPrice} THB
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
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
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ItemsForm;

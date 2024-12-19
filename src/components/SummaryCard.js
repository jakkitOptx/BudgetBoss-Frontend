import React from "react";

const SummaryCard = ({ title, value, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded shadow`}>
    <h2 className={`text-lg font-semibold ${textColor}`}>{title}</h2>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
  </div>
);

export default SummaryCard;
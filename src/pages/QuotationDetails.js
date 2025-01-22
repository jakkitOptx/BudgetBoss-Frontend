import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { pdf } from "@react-pdf/renderer";
import QuotationPreview from "../components/QuotationPreview";
import { FaFilePdf } from "react-icons/fa";
import bankAccounts from "../data/bankAccounts.json";
import { apiURL } from "../config/config";


const handleDownloadPDF = async (quotation, clientDetails) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const company = user.company || "";
    const email = user.username || "";
    const domain = email.split("@")[1]?.split(".")[0] || "";
    const companyName =
      domain === "neonworks" ? "NEON" : domain === "optx" ? "OPTX" : "UNKNOWN";

    // Fetch bank information
    const bankInfo = bankAccounts.companies?.[company] || {
      accountOwner: "N/A",
      accountNo: "N/A",
      accountType: "N/A",
      bankName: "N/A",
      branchName: "N/A",
      bankAddress: "N/A",
      swiftCode: "N/A",
    };

    const year = new Date(quotation.documentDate).getFullYear();
    const documentNo = `${companyName}(${quotation.type})-${year}-${quotation.runNumber}`;
    const fileName = `${documentNo} - ${quotation.projectName}.pdf`;

    // Add client details to the quotation data
    const updatedQuotation = {
      ...quotation,
      clientDetails,
    };

    // Generate PDF Blob
    const blob = await pdf(
      <QuotationPreview quotationData={updatedQuotation} bankInfo={bankInfo} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF.");
  }
};

const QuotationDetails = () => {
  const { id } = useParams(); // Get `id` from URL Parameter
  const [quotation, setQuotation] = useState(null); // Quotation data
  const [clientDetails, setClientDetails] = useState(null); // Client details
  const [loading, setLoading] = useState(true); // Loading status

  // Fetch Quotation and Client Details
  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiURL}quotations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("data quotations QuotationDetails ==>", data);

        setQuotation(data);

        // Fetch client details
        if (data.clientId) {
          const clientResponse = await axios.get(
            `${apiURL}clients/${data.clientId._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("data clients QuotationDetails ==>", data);

          setClientDetails(clientResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotation details:", error);
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [id]);

  // If loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // If no quotation data
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
      {/* Download PDF Button */}
      <div className="flex justify-end mt-6 mb-6">
        <button
          onClick={() => handleDownloadPDF(quotation, clientDetails)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <FaFilePdf size={16} /> {/* Icon */}
          Download PDF
        </button>
      </div>

      {/* Basic Information */}
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
          <p>
            <span className="font-bold">Credit Term:</span>{" "}
            {quotation.CreditTerm ? `${quotation.CreditTerm} days` : "N/A"}
          </p>
          <p>
            <span className="font-bold">Remark:</span>{" "}
            {quotation.remark || "N/A"}
          </p>
        </div>
      </div>

      {/* Items Section */}
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
                  <td className="py-2">
                    {item.unitPrice
                      ? parseFloat(item.unitPrice).toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })
                      : "-"}
                  </td>
                  <td className="py-2">
                    {item.amount
                      ? item.amount.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                        })
                      : "-"}
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
              {quotation.netAmount
                ? quotation.netAmount.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })
                : "-"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;

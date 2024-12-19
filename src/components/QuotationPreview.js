import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import ThaiBaht from "thai-baht-text";

// ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: "Prompt",
  fonts: [
    { src: "/fonts/Prompt-Regular.ttf" }, // Regular font
    { src: "/fonts/Prompt-Bold.ttf", fontWeight: "bold" }, // Bold font
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Prompt",
  },
  header: {
    marginBottom: 10,
    textAlign: "left",
    fontSize: 8,
  },
  section: {
    marginBottom: 20,
  },
  itemsTable: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 0,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeaderNo: {
    width: "8%", // ช่อง No. เล็กลง
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    fontSize: 8,
  },
  tableColHeaderDesc: {
    flexGrow: 1, // ขยายใหญ่เท่าที่จำเป็น
    flexShrink: 1,
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "left",
    padding: 3,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    fontSize: 8,
  },
  tableColHeader: {
    width: "16%", // ช่อง Units, Unit Price และ Amount เท่ากัน
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    fontSize: 8,
  },
  tableColNo: {
    width: "8%", // ช่อง No. เล็กลง
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3,
    fontSize: 8,
  },
  tableColDesc: {
    flexGrow: 1, // ช่อง Description ขยายเต็มที่
    flexShrink: 1,
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "left",
    padding: 3,
    fontSize: 8,
  },
  tableCol: {
    width: "16%", // ช่อง Units, Unit Price และ Amount เท่ากัน
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3,
    minHeight: 25,
    fontSize: 8,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "solid",
    fontSize: 8,
  },
  paymentDetails: {
    width: "50%",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRightWidth: 1,
    borderStyle: "solid",
    fontSize: 8,
  },
  summary: {
    width: "50%",
    padding: 10,
    fontSize: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    padding: 5,
    fontSize: 8,
  },
  summaryRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    fontSize: 8,
  },
  characterAmount: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 10,
    borderTopWidth: 1,
    borderStyle: "solid",
    paddingTop: 5,
    fontSize: 8,
  },
  signatureSection: {
    marginTop: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
  },
  signatureBlock: {
    textAlign: "center",
    width: "30%",
    borderTopWidth: 1,
    borderStyle: "solid",
    fontSize: 8,
  },
});

const QuotationPreview = ({ quotationData, bankInfo }) => {
  const defaultBankInfo = {
    accountOwner: "N/A",
    accountNo: "N/A",
    accountType: "N/A",
    bankName: "N/A",
    branchName: "N/A",
    bankAddress: "N/A",
    swiftCode: "N/A",
  };

  const finalBankInfo = { ...defaultBankInfo, ...bankInfo };

  const renderHeader = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const companyName = user.company?.toUpperCase() || "UNKNOWN";
    const year = new Date(quotationData.documentDate).getFullYear();
    const documentNo = `${companyName}(${quotationData.type})-${year}-${quotationData.runNumber}`;

    return (
      <View style={styles.header}>
        <Text style={{ fontSize: 12, fontWeight: "bold" }}>Quotation</Text>
        <View style={styles.section}>
          <Text>Document No: {documentNo}</Text>
          <Text>
            Document Date:{" "}
            {new Date(quotationData.documentDate).toLocaleDateString("th-TH")}
          </Text>
          <Text>Salesperson: {quotationData.salePerson}</Text>
          <Text>Project Name: {quotationData.projectName}</Text>
          <Text>Project Run: {quotationData.period}</Text>
          <Text>Customer Name: {quotationData.client}</Text>
        </View>
      </View>
    );
  };

  const renderTableHeader = () => (
    <View style={styles.tableRow}>
      <Text style={styles.tableColHeaderNo}>No.</Text>
      <Text style={styles.tableColHeaderDesc}>Description</Text>
      <Text style={styles.tableColHeader}>Units</Text>
      <Text style={styles.tableColHeader}>Unit Price</Text>
      <Text style={styles.tableColHeader}>Amount</Text>
    </View>
  );

  const renderItems = (items, startIndex = 0) => {
    const maxRows = items.length <= 10 ? 10 : 27;
    const itemsToRender = [...items];

    while (itemsToRender.length < maxRows) {
      itemsToRender.push({});
    }

    return itemsToRender.map((item, index) => (
      <View style={styles.tableRow} key={index}>
        <Text style={styles.tableColNo}>
          {item.description ? startIndex + index + 1 : ""}
        </Text>
        <Text style={styles.tableColDesc}>{item.description || ""}</Text>
        <Text style={styles.tableCol}>{item.unit || ""}</Text>
        <Text style={styles.tableCol}>
          {item.unitPrice
            ? parseFloat(item.unitPrice).toLocaleString("th-TH", {
                style: "decimal",
                minimumFractionDigits: 2,
              })
            : ""}
        </Text>
        <Text style={styles.tableCol}>
          {item.unit && item.unitPrice
            ? (item.unit * item.unitPrice).toLocaleString("th-TH", {
                style: "decimal",
                minimumFractionDigits: 2,
              })
            : ""}
        </Text>
      </View>
    ));
  };

  const renderSummaryAndPaymentDetails = () => (
    <View style={styles.summaryContainer}>
      {/* ช่อง Payment Details */}
      <View style={styles.paymentDetails}>
        {/* Remark */}
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Remark</Text>
        <Text>{quotationData.remark || "-"}</Text>
        <View
          style={{ borderTopWidth: 1, borderStyle: "solid", marginVertical: 5 }}
        ></View>
        <Text style={{ fontWeight: "bold" }}>รายละเอียดการชำระเงิน :</Text>
        <Text>Payment Details</Text>
        <Text>- ระยะเวลา Credit Term {quotationData.CreditTerm || 0} วัน</Text>
        <View
          style={{ borderTopWidth: 1, borderStyle: "solid", marginVertical: 5 }}
        ></View>
        <Text style={{ fontWeight: "bold" }}>
          You can transfer to owner account:
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>ACCOUNT OWNER : </Text>
          <Text>{finalBankInfo.accountOwner || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>ACCOUNT NO : </Text>
          <Text>{finalBankInfo.accountNo || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>ACCOUNT TYPE : </Text>
          <Text>{finalBankInfo.accountType || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>BANK NAME : </Text>
          <Text>{finalBankInfo.bankName || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>BRANCH NAME : </Text>
          <Text>{finalBankInfo.branchName || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>BANK ADDRESS : </Text>
          <Text>{finalBankInfo.bankAddress || "-"}</Text>
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>SWIFT CODE : </Text>
          <Text>{finalBankInfo.swiftCode || "-"}</Text>
        </Text>
      </View>

      {/* ช่อง Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Total Before Fee:</Text>
          <Text>
            {(quotationData.totalBeforeFee || 0).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Fee ({quotationData.fee || 0}%):</Text>
          <Text>
            {(
              (quotationData.totalBeforeFee || 0) *
              ((quotationData.fee || 0) / 100)
            ).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total:</Text>
          <Text>
            {(quotationData.total || 0).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Discount:</Text>
          <Text>
            {(quotationData.discount || 0).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Amount Before Tax:</Text>
          <Text>
            {parseFloat(
              (quotationData.amountBeforeTax || 0).toFixed(2)
            ).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>VAT (7%):</Text>
          <Text>
            {parseFloat((quotationData.vat || 0).toFixed(2)).toLocaleString(
              "th-TH",
              {
                style: "decimal",
                minimumFractionDigits: 2,
              }
            )}
          </Text>
        </View>
        <View style={styles.summaryRowLast}>
          <Text>Net Amount:</Text>
          <Text>
            {parseFloat(
              (quotationData.netAmount || 0).toFixed(2)
            ).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCharacterAmount = () => (
    <Text style={styles.characterAmount}>
      {`จำนวนเงินตัวอักษร\nCharacter Amount: (${ThaiBaht(
        quotationData.netAmount || 0
      )})`}
    </Text>
  );

  const renderSignature = () => (
    <View style={styles.signatureSection}>
      {/* ช่องลายเซ็น Customer */}
      <View style={styles.signatureBlock}>
        <Text style={{ fontWeight: "bold" }}>Customer</Text>
        <Text style={{ marginTop: 10, width: "100%", textAlign: "center" }}>
          (____________________________________)
        </Text>
        <Text style={{ marginTop: 10 }}>วันที่/Date ............./............./.............</Text>
      </View>
      {/* ช่องลายเซ็น Created by */}
      <View style={styles.signatureBlock}>
        <Text style={{ fontWeight: "bold" }}>Created by</Text>
        <Text style={{ marginTop: 10, width: "100%", textAlign: "center" }}>
          (____________________________________)
        </Text>
        <Text style={{ marginTop: 10 }}>วันที่/Date ............./............./.............</Text>
      </View>
      {/* ช่องลายเซ็น Proposed by */}
      <View style={styles.signatureBlock}>
        <Text style={{ fontWeight: "bold" }}>Proposed by</Text>
        <Text style={{ marginTop: 10, width: "100%", textAlign: "center" }}>
          (____________________________________)
        </Text>
        <Text style={{ marginTop: 10 }}>วันที่/Date ............./............./.............</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <View style={styles.itemsTable}>
          {renderTableHeader()}
          {renderItems(quotationData.items.slice(0, 27), 0)}
        </View>
        {quotationData.items.length <= 27 && (
          <>
            {renderSummaryAndPaymentDetails()}
            {renderCharacterAmount()}
            {renderSignature()}
          </>
        )}
      </Page>
      {quotationData.items.length > 27 && (
        <Page size="A4" style={styles.page}>
          {renderSummaryAndPaymentDetails()}
          {renderCharacterAmount()}
          {renderSignature()}
        </Page>
      )}
    </Document>
  );
};

export default QuotationPreview;

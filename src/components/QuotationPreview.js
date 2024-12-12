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
    fontSize: 10,
    fontFamily: "Prompt",
  },
  header: {
    marginBottom: 10,
    textAlign: "left",
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
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3, // ลด padding
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 3, // ลด padding
    textAlign: "center",
    minHeight: 20, // ลด minHeight
    fontFamily: "Prompt",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "solid",
  },
  paymentDetails: {
    width: "50%",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRightWidth: 1,
    borderStyle: "solid",
  },
  summary: {
    width: "50%",
    padding: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    padding: 5,
  },
  summaryRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  characterAmount: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 10,
    borderTopWidth: 1,
    borderStyle: "solid",
    paddingTop: 5,
  },
  signatureSection: {
    marginTop: 80,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    textAlign: "center",
    width: "30%",
    borderTopWidth: 1,
    borderStyle: "solid",
  },
});

const QuotationPreview = ({ quotationData }) => {
  const renderHeader = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const email = user.username || "";
    const domain = email.split("@")[1]?.split(".")[0] || "";
    const companyName =
      domain === "neonworks" ? "NEON" : domain === "optx" ? "OPTX" : "UNKNOWN";
    const year = new Date(quotationData.documentDate).getFullYear();
    const documentNo = `${companyName}(${quotationData.type})-${year}-${quotationData.runNumber}`;

    return (
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Quotation</Text>
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
      <Text style={styles.tableColHeader}>No.</Text>
      <Text style={styles.tableColHeader}>Description</Text>
      <Text style={styles.tableColHeader}>Units</Text>
      <Text style={styles.tableColHeader}>Unit Price</Text>
      <Text style={styles.tableColHeader}>Amount</Text>
    </View>
  );

  const renderItems = (items, startIndex = 0) => {
    const maxRows = items.length <= 10 ? 10 : 27; // ถ้าจำนวน items <= 10 แสดง 10 แถว, ถ้าเกินแสดง 27 แถว
    const itemsToRender = [...items];
    while (itemsToRender.length < maxRows) {
      itemsToRender.push({}); // เติม row ว่าง
    }

    return itemsToRender.map((item, index) => (
      <View style={styles.tableRow} key={index}>
        <Text style={styles.tableCol}>
          {item.description ? startIndex + index + 1 : ""}
        </Text>
        <Text style={styles.tableCol}>{item.description || ""}</Text>
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
      <View style={styles.paymentDetails}>
        <Text style={{ fontWeight: "bold" }}>รายละเอียดการชำระเงินน</Text>
        <Text>Payment Details</Text>
        <Text>- ระยะเวลา Credit Term {quotationData.CreditTerm || 0} วัน</Text>
      </View>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Total Before Fee:</Text>
          <Text>
            {quotationData.totalBeforeFee.toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Fee ({quotationData.fee}%):</Text>
          <Text>
            {(
              quotationData.totalBeforeFee *
              (quotationData.fee / 100)
            ).toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total:</Text>
          <Text>
            {quotationData.total.toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Discount:</Text>
          <Text>
            {quotationData.discount.toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Amount Before Tax:</Text>
          <Text>
            {quotationData.amountBeforeTax.toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>VAT (7%):</Text>
          <Text>
            {quotationData.vat.toLocaleString("th-TH", {
              style: "decimal",
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.summaryRowLast}>
          <Text>Net Amount:</Text>
          <Text>
            {quotationData.netAmount.toLocaleString("th-TH", {
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
      <View style={styles.signatureBlock}>
        <Text>Customer</Text>
      </View>
      <View style={styles.signatureBlock}>
        <Text>Created by</Text>
      </View>
      <View style={styles.signatureBlock}>
        <Text>Proposed by</Text>
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

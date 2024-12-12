import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

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
    fontFamily: "Prompt", // เปลี่ยนฟอนต์เป็น Prompt
  },
  header: {
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "Prompt", // เพิ่มฟอนต์ในส่วน Header
  },
  section: {
    marginBottom: 20,
  },
  itemsTable: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    minHeight: 20,
    fontFamily: "Prompt", // ฟอนต์ภาษาไทยในตาราง
  },
  summary: {
    marginTop: 20,
    marginLeft: "auto",
    borderWidth: 1,
    borderStyle: "solid",
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderStyle: "solid",
    padding: 5,
  },
  summaryRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
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
    // ดึงข้อมูล username จาก localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const email = user.username || "";
    const domain = email.split("@")[1]?.split(".")[0] || "";

    // ตรวจสอบชื่อบริษัท
    const companyName =
      domain === "neonworks" ? "NEON" : domain === "optx" ? "OPTX" : "UNKNOWN";

    // ดึงปีที่ออกเอกสาร
    const year = new Date(quotationData.documentDate).getFullYear();

    // สร้าง Document No ตามรูปแบบ
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
    const maxRows = 12;
    const itemsToRender = [...items];
    while (itemsToRender.length < maxRows) {
      itemsToRender.push({});
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

  const renderSummary = () => (
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
      {/* หน้าแรก */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <View style={styles.itemsTable}>
          {renderTableHeader()}
          {renderItems(quotationData.items.slice(0, 12), 0)}{" "}
          {/* Start from 0 */}
        </View>
        {quotationData.items.length <= 12 && (
          <>
            {renderSummary()}
            {renderSignature()}
          </>
        )}
      </Page>
      {/* หน้าถัดไป */}
      {quotationData.items.length > 12 && (
        <Page size="A4" style={styles.page}>
          {renderHeader()}
          <View style={styles.itemsTable}>
            {renderTableHeader()}
            {renderItems(quotationData.items.slice(12), 12)}{" "}
            {/* Start from 12 */}
          </View>
          {renderSummary()}
          {renderSignature()}
        </Page>
      )}
    </Document>
  );
};

export default QuotationPreview;

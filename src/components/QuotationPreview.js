import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import ThaiBaht from "thai-baht-text";
import { styles } from "./styles";

// ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: "Prompt",
  fonts: [
    { src: "/fonts/Prompt-Regular.ttf" }, // Regular font
    { src: "/fonts/Prompt-Bold.ttf", fontWeight: "bold" }, // Bold font
  ],
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

  // ส่วนหัวใบเสนอราคา
  const renderTitle = () => (
    <Text style={styles.headerTitle}>ใบเสนอราคา{"\n"}QUOTATION</Text>
  );

  const renderProjectDetails = () => {
    return (
      <View style={styles.projectDetailsContainer}>
        <View style={styles.projectDetail}>
          <Text style={styles.projectLabel}>ชื่อโครงการ{"\n"}Project Name</Text>
          <Text style={styles.projectValue}>
            {quotationData.projectName || "-"}
          </Text>
        </View>
        <View style={styles.projectDetail}>
          <Text style={styles.projectLabel}>วันที่จัดงาน{"\n"}Project Run</Text>
          <Text style={styles.projectValue}>{quotationData.period || "-"}</Text>
        </View>
      </View>
    );
  };

  const finalBankInfo = { ...defaultBankInfo, ...bankInfo };
  // รายละเอียดเอกสาร

  // const renderHeader = () => {
  //   const user = JSON.parse(localStorage.getItem("user")) || {};
  //   const companyName = user.company?.toUpperCase() || "UNKNOWN";
  //   const year = new Date(quotationData.documentDate).getFullYear();
  //   const documentNo = `${companyName}(${quotationData.type})-${year}-${quotationData.runNumber}`;
  //   const { clientDetails } = quotationData;

  //   return (
  //     <View style={styles.header}>
  //       <View style={{ flex: 1 }} />
  //       <View style={styles.headerDetailsContainer}>
  //         <View style={styles.detailRow}>
  //           <Text style={styles.label}>Document No.:</Text>
  //           <Text style={styles.value}>{documentNo}</Text>
  //         </View>
  //         <View style={styles.detailRow}>
  //           <Text style={styles.label}>Document Date:</Text>
  //           <Text style={styles.value}>
  //             {new Date(quotationData.documentDate).toLocaleDateString("th-TH")}
  //           </Text>
  //         </View>
  //         <View style={styles.detailRow}>
  //           <Text style={styles.label}>Client Name:</Text>
  //           <Text style={styles.value}>
  //             {clientDetails?.customerName || "N/A"}
  //           </Text>
  //         </View>
  //         <View style={styles.detailRow}>
  //           <Text style={styles.label}>Client Address:</Text>
  //           <Text style={styles.value}>
  //             {clientDetails?.address || "N/A"}
  //           </Text>
  //         </View>
  //         <View style={styles.detailRow}>
  //           <Text style={styles.label}>Client Contact:</Text>
  //           <Text style={styles.value}>
  //             {clientDetails?.contact || "N/A"}
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };
  const renderHeader = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const companyName = user.company?.toUpperCase() || "UNKNOWN";
    const year = new Date(quotationData.documentDate).getFullYear();
    const documentNo = `${companyName}(${quotationData.type})-${year}-${quotationData.runNumber}`;
    const { clientDetails } = quotationData;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        {/* ฝั่งซ้าย: ข้อมูลลูกค้า */}
        <View style={{ flex: 1 }}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>
              {quotationData.clientDetails?.customerName || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{clientDetails?.address || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tax ID:</Text>
            <Text style={styles.value}>
              {clientDetails?.taxIdentificationNumber || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>
              {clientDetails?.contactPhoneNumber || "N/A"}
            </Text>
          </View>
        </View>

        {/* ฝั่งขวา: รายละเอียดเอกสาร */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Document No.:</Text>
            <Text style={styles.value}>{documentNo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Document Date:</Text>
            <Text style={styles.value}>
              {new Date(quotationData.documentDate).toLocaleDateString("th-TH")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Salesperson:</Text>
            <Text style={styles.value}>
              {quotationData.salePerson || "N/A"}
            </Text>
          </View>
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
      <View style={styles.paymentDetails}>
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
        <Text style={{ marginTop: 10 }}>
          วันที่/Date ............./............./.............
        </Text>
      </View>
      {/* ช่องลายเซ็น Created by */}
      <View style={styles.signatureBlock}>
        <Text style={{ fontWeight: "bold" }}>Created by</Text>
        <Text style={{ marginTop: 10, width: "100%", textAlign: "center" }}>
          (____________________________________)
        </Text>
        <Text style={{ marginTop: 10 }}>
          วันที่/Date ............./............./.............
        </Text>
      </View>
      {/* ช่องลายเซ็น Proposed by */}
      <View style={styles.signatureBlock}>
        <Text style={{ fontWeight: "bold" }}>Proposed by</Text>
        <Text style={{ marginTop: 10, width: "100%", textAlign: "center" }}>
          (____________________________________)
        </Text>
        <Text style={{ marginTop: 10 }}>
          วันที่/Date ............./............./.............
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderTitle()}
        {renderHeader()}
        {/* แสดงรายละเอียดโครงการและวันที่ */}
        {renderProjectDetails()}
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

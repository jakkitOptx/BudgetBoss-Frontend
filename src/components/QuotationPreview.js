import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import ThaiBaht from "thai-baht-text";
import { styles } from "./styles";

// ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: "NotoSansThai",
  fonts: [
    { src: "/fonts/NotoSansThai-Regular.ttf" }, // Regular font
    { src: "/fonts/NotoSansThai-Bold.ttf", fontWeight: "bold" }, // Bold font
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

  // ตรวจสอบว่าเนื้อหาในหน้าแรกเกินเส้นแดง (ประมาณ 70%) ของหน้า A4 หรือไม่
  const isContentExceedingLimit = (items) => {
    const maxPageHeight = 842; // ความสูงของ A4 ใน pt
    const headerHeight = 150; // ความสูงของส่วนหัวใน pt
    const maxHeight = maxPageHeight * 0.7; // 70% ของ A4
    const contentHeight =
      headerHeight +
      items.reduce((totalHeight, item) => {
        return totalHeight + calculateRowHeight(item.description || "");
      }, 0);

    return contentHeight > maxHeight; // ตรวจสอบว่าเกิน 70% หรือไม่
  };

  // การคำนวณจำนวนแถวในหน้าแรกและหน้าที่สอง
  const calculateMaxRowsPerPage = () => {
    const maxPageHeight = 842; // ความสูงของ A4 ใน pt
    const headerHeight = 150; // ความสูงโดยประมาณของส่วนหัว
    const rowHeight = 20; // ความสูงเฉลี่ยของแต่ละแถวในตาราง
    const maxRowsFirstPage = Math.floor(
      (maxPageHeight * 0.7 - headerHeight) / rowHeight
    );
    const maxRowsOtherPages = Math.floor(
      (maxPageHeight - headerHeight) / rowHeight
    );

    return { maxRowsFirstPage, maxRowsOtherPages };
  };

  // ตรวจสอบว่าเนื้อหาน้อยกว่า 40% ของหน้า A4 หรือไม่
  const isContentBelowLimit = (items) => {
    const maxPageHeight = 842; // ความสูงของ A4 ใน pt
    const headerHeight = 150; // ความสูงของส่วนหัวใน pt
    const limitHeight = maxPageHeight * 0.4; // 40% ของ A4
    const contentHeight =
      headerHeight +
      items.reduce((totalHeight, item) => {
        return totalHeight + calculateRowHeight(item.description || "");
      }, 0);

    return contentHeight <= limitHeight; // ตรวจสอบว่าไม่เกิน 40% หรือไม่
  };

  const calculateRowHeight = (description) => {
    const baseHeight = 20; // ความสูงพื้นฐานของแถวใน pt
    const lineHeight = 15; // ความสูงต่อบรรทัดเพิ่มเติมใน pt
    const lines = description ? description.split("\n").length : 1; // จำนวนบรรทัด
    return baseHeight + (lines - 1) * lineHeight; // คำนวณความสูงรวม
  };

  // ส่วนหัวใบเสนอราคา
  const renderTitle = () => (
    <Text style={styles.headerTitle}>ใบเสนอราคา{"\n"}QUOTATION</Text>
  );

  const renderProjectDetails = () => {
    return (
      <View style={styles.projectDetailsContainer}>
        <View style={styles.detailRowProjectDetails}>
          <Text style={styles.label}>Project Name</Text>
          <Text style={styles.value}>{quotationData.projectName || "-"}</Text>
        </View>
        <View style={styles.detailRowProjectDetails}>
          <Text style={styles.label}>Project Run</Text>
          <Text style={styles.value}>{quotationData.period || "-"}</Text>
        </View>
      </View>
    );
  };

  const finalBankInfo = { ...defaultBankInfo, ...bankInfo };
  // รายละเอียดเอกสาร

  const renderHeader = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const companyName = user.company?.toUpperCase() || "UNKNOWN";
    const year = new Date(quotationData.documentDate).getFullYear();
    const documentNo = `${companyName}(${quotationData.type})-${year}-${quotationData.runNumber}`;
    const { clientDetails } = quotationData;
    console.log("Customer Name:", quotationData.clientDetails?.customerName);
    const addTrailingSpaces = (text, spacesCount = 2) => {
      if (!text) return text; // หากไม่มีข้อความให้คืนค่าเดิม
      return text + " ".repeat(spacesCount); // เพิ่ม space ตามจำนวนที่กำหนด
    };

    return (
      <View style={styles.header}>
        {/* ฝั่งซ้ายแสดงข้อมูลลูกค้า */}
        <View style={styles.clientDetailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer Name:</Text>
            {/* <Text  style={styles.value}>{clientDetails?.customerName || "N/A"}</Text> */}
            <Text style={styles.value}>
              {addTrailingSpaces(
                quotationData.clientDetails?.customerName || "N/A",
                2
              )}
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

        {/* ฝั่งขวาแสดงรายละเอียดเอกสาร */}
        <View style={styles.headerDetailsContainer}>
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
            <Text style={styles.value}>{quotationData.salePerson || "-"}</Text>
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

  const renderItemsWithSpacing = (items, startIndex = 0, maxRows) => {
    const renderedItems = items.slice(0, maxRows).map((item, index) => (
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

    // ตรวจสอบกรณีที่เนื้อหาเกิน 40% แต่ไม่เกิน 70%
    const isSpacingRequired =
      !isContentBelowLimit(items) && !isContentExceedingLimit(items);

    return (
      <>
        {renderedItems}
        {/* เพิ่มพื้นที่ว่างใต้ตาราง หากอยู่ในช่วง 40% - 70% */}
        {isSpacingRequired && (
          <>
            {/* เติมช่องว่างแบบตาราง */}
            {Array.from(
              { length: Math.min(maxRows - items.length, 3) }, // จำกัดการเติมช่องว่างไม่เกิน 3 แถว
              (_, i) => (
                <View style={styles.tableRow} key={`empty-${i}`}>
                  <Text style={styles.tableColNo}></Text>
                  <Text style={styles.tableColDesc}></Text>
                  <Text style={styles.tableCol}></Text>
                  <Text style={styles.tableCol}></Text>
                  <Text style={styles.tableCol}></Text>
                </View>
              )
            )}
            {/* เติมพื้นที่ว่างเล็กน้อยเพื่อความสมดุล */}
            <View
              style={{
                height: 10, // ลดความสูงเพื่อให้สมดุล
              }}
            />
          </>
        )}
      </>
    );
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

  const footerHeight = 150; // ความสูงโดยประมาณของ Summary และ Signature
  const isFooterExceedingPage = (items, rowsUsed) => {
    const maxPageHeight = 842; // ความสูงของ A4 ใน pt
    const headerHeight = 150; // ความสูงของส่วนหัวใน pt
    const rowHeight = 20; // ความสูงเฉลี่ยของแต่ละแถวในตาราง
    const contentHeight = headerHeight + rowsUsed * rowHeight;

    return contentHeight + footerHeight > maxPageHeight; // ตรวจสอบว่าเกินหน้า A4 หรือไม่
  };

  const paginateItems = (items, maxRowsPerPage) => {
    const pages = [];
    let currentPage = [];

    items.forEach((item, index) => {
      if (currentPage.length >= maxRowsPerPage) {
        pages.push(currentPage); // เพิ่มหน้าปัจจุบันเข้าไปใน pages
        currentPage = []; // เริ่มหน้าใหม่
      }
      currentPage.push(item);
    });

    if (currentPage.length > 0) {
      pages.push(currentPage); // เพิ่มหน้าสุดท้ายเข้าไปใน pages
    }

    return pages;
  };

  const renderPaginatedItems = (items) => {
    const { maxRowsFirstPage, maxRowsOtherPages } = calculateMaxRowsPerPage();
    const pages = paginateItems(items, maxRowsFirstPage, maxRowsOtherPages);
  
    let startIndex = 0;
  
    return pages.map((pageItems, pageIndex) => {
      const currentPageStartIndex = startIndex;
      startIndex += pageItems.length;
  
      // คำนวณพื้นที่เนื้อหาของหน้าปัจจุบัน
      const contentHeight = pageItems.reduce((total, item) => {
        return total + calculateRowHeight(item.description || "");
      }, 0);
  
      const maxPageHeight = 842; // ความสูง A4
      const contentLimit = maxPageHeight * 0.6; // ใช้ 60% ของความสูง A4
      const shouldMoveToNextPage = contentHeight > contentLimit;
  
      return (
        <Page size="A4" style={styles.page} key={pageIndex}>
          {pageIndex === 0 && (
            <>
              {renderTitle()}
              {renderHeader()}
              {renderProjectDetails()}
            </>
          )}
          <View style={styles.itemsTable}>
            {renderTableHeader()}
            {renderItemsWithSpacing(pageItems, currentPageStartIndex, maxRowsFirstPage)}
          </View>
          {/* แสดง Summary, Signature ในหน้าสุดท้าย */}
          {pageIndex === pages.length - 1 && !shouldMoveToNextPage && (
            <>
              {renderSummaryAndPaymentDetails()}
              {renderCharacterAmount()}
              {renderSignature()}
            </>
          )}
        </Page>
      );
    }).concat(
      pages.some((pageItems, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        const contentHeight = pageItems.reduce((total, item) => {
          return total + calculateRowHeight(item.description || "");
        }, 0);
  
        const maxPageHeight = 842; // ความสูง A4
        const contentLimit = maxPageHeight * 0.6; // ใช้ 60% ของความสูง A4
  
        return isLastPage && contentHeight > contentLimit;
      })
        ? [
            <Page size="A4" style={styles.page} key="footer">
              {renderSummaryAndPaymentDetails()}
              {renderCharacterAmount()}
              {renderSignature()}
            </Page>,
          ]
        : []
    );
  };
  
  

  return <Document>{renderPaginatedItems(quotationData.items)}</Document>;
};

export default QuotationPreview;

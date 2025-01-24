// styles.js ใช้สำหรับ render PDF ในหน้า QuotationPreview.js
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "NotoSansThai",
  },
  header: {
    flexDirection: "row", // จัดเรียงในแนวนอน
    justifyContent: "space-between", // เพิ่มระยะห่างระหว่าง title กับ details
    alignItems: "flex-start", // จัดให้อยู่ด้านบนสุด
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#4A3F7D",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A3F7D",
    textAlign: "right", // จัดให้อยู่ชิดขวา
    flex: 1,
  },
  clientDetailsContainer: {
    width: "50%", // ใช้พื้นที่ครึ่งหนึ่งของหน้า
    flexDirection: "column", // เรียงข้อมูลในแนวตั้ง
    paddingRight: 10, // เพิ่มระยะห่างขวา
  },
  headerDetailsContainer: {
    width: "50%", // ใช้พื้นที่อีกครึ่งหนึ่งของหน้า
    flexDirection: "column", // เรียงข้อมูลในแนวตั้ง
    alignItems: "flex-end", // จัดข้อความชิดขวา
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  detailRowProjectDetails: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4A3F7D",
    width: "30%", // ลดความกว้างของ label เพื่อเพิ่มพื้นที่ให้ value
    textAlign: "left",
  },
  value: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#000000",
    width: "70%", // เพิ่มพื้นที่ให้ value
    textAlign: "left", // จัดข้อความชิดซ้าย
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingLeft: 1, // เพิ่ม padding ซ้ายเพื่อให้ดูเรียบร้อย
  },
  projectDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
  },
  projectDetail: {
    flex: 1,
    paddingHorizontal: 10,
  },
  projectLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4A3F7D",
    textAlign: "left",
    marginBottom: 4,
  },
  projectValue: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#000000",
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
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
    width: "8%",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 3,
    fontSize: 8,
  },
  tableColDesc: {
    flexGrow: 1,
    flexShrink: 1,
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "left",
    padding: 3,
    fontSize: 8,
  },
  tableCol: {
    width: "16%",
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

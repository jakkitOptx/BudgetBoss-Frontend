// buttonVisibility.js
/**
 * ✅ ฟังก์ชันตรวจสอบว่าแสดงปุ่ม Approve ได้หรือไม่
 * - อนุญาตเฉพาะผู้ที่มี level > 1
 * - ต้องเป็น Quotation ที่อยู่ในสถานะ "Pending"
 */
export const canApprove = (approvalStatus, userLevel) => {
  return approvalStatus === "Pending" && userLevel > 1;
};

/**
 * ✅ ฟังก์ชันตรวจสอบว่าแสดงปุ่ม Reject ได้หรือไม่
 * - อนุญาตเฉพาะผู้ที่มี level > 1
 * - ต้องเป็น Quotation ที่อยู่ในสถานะ "Pending"
 */
export const canReject = (approvalStatus, userLevel) => {
  return approvalStatus === "Pending" && userLevel > 1;
};

/**
 * ✅ ฟังก์ชันตรวจสอบว่าแสดงปุ่ม Cancel ได้หรือไม่
 * - อนุญาตเฉพาะ Level >= 2 เท่านั้น
 * - ต้องเป็น Quotation ที่ไม่ใช่ "Approved"
 */
export const canCancel = (approvalStatus, userLevel) => {
  return approvalStatus !== "Approved" && userLevel >= 2;
};

/**
 * ✅ ฟังก์ชันตรวจสอบว่าแสดงปุ่ม Edit และ Delete ได้หรือไม่
 * - ซ่อนปุ่ม Edit และ Delete ถ้า approvalStatus เป็น "Canceled"
 */
export const canEditDelete = (approvalStatus) => {
  return approvalStatus !== "Canceled"; // ถ้า Canceled จะ return false -> ซ่อนปุ่ม
};

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
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
    marginTop: 20,
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

const QuotationPreview = ({ quotationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Quotation</Text>
      </View>

      <View style={styles.section}>
        <Text>Title: {quotationData.title}</Text>
        <Text>Client: {quotationData.client}</Text>
        <Text>Sale Person: {quotationData.salePerson}</Text>
        <Text>
          Document Date: {new Date(quotationData.documentDate).toLocaleDateString("th-TH")}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Items</Text>
        <View style={styles.itemsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>No.</Text>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Units</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Amount</Text>
          </View>
          {[...Array(20)].map((_, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>
                {quotationData.items[index] ? index + 1 : ""}
              </Text>
              <Text style={styles.tableCol}>
                {quotationData.items[index]?.description || ""}
              </Text>
              <Text style={styles.tableCol}>
                {quotationData.items[index]?.unit || ""}
              </Text>
              <Text style={styles.tableCol}>
                {quotationData.items[index]?.unitPrice
                  ? parseFloat(quotationData.items[index].unitPrice).toLocaleString("th-TH", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })
                  : ""}
              </Text>
              <Text style={styles.tableCol}>
                {quotationData.items[index]?.unit && quotationData.items[index]?.unitPrice
                  ? (quotationData.items[index].unit * quotationData.items[index].unitPrice).toLocaleString("th-TH", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })
                  : ""}
              </Text>
            </View>
          ))}
        </View>
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
            {(quotationData.totalBeforeFee * (quotationData.fee / 100)).toLocaleString("th-TH", {
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

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

export default QuotationPreview;

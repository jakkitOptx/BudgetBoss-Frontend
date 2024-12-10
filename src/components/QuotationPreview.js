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
  table: {
    display: "table",
    width: "auto",
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    textAlign: "center",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
  },
  tableCell: {
    margin: "auto",
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
        <Text>Document Date: {quotationData.documentDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Items</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>#</Text>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Units</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Amount</Text>
          </View>
          {quotationData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{index + 1}</Text>
              <Text style={styles.tableCol}>{item.description}</Text>
              <Text style={styles.tableCol}>{item.unit}</Text>
              <Text style={styles.tableCol}>{item.unitPrice.toLocaleString()}</Text>
              <Text style={styles.tableCol}>{(item.unit * item.unitPrice).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Summary</Text>
        <Text>Total Before Fee: {quotationData.totalBeforeFee.toLocaleString()}</Text>
        <Text>Fee ({quotationData.fee}%): {(quotationData.totalBeforeFee * (quotationData.fee / 100)).toLocaleString()}</Text>
        <Text>Discount: {quotationData.discount.toLocaleString()}</Text>
        <Text>Net Amount: {quotationData.netAmount.toLocaleString()}</Text>
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

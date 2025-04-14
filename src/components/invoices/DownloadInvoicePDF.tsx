
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import jsPDF from "jspdf";
import { Client, Invoice, Payment } from "@/types";

interface DownloadInvoicePDFProps {
  invoice: Invoice;
  client: Client;
  payments: Payment[];
}

const DownloadInvoicePDF = ({ invoice, client, payments }: DownloadInvoicePDFProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add company logo/name
    doc.setFontSize(20);
    doc.text("InvoiceVista", 20, 20);
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #${invoice.id.toString().padStart(4, '0')}`, 20, 40);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 50);
    
    // Add client details
    doc.text("Billed To:", 20, 70);
    doc.text(client.name, 20, 80);
    doc.text(client.company || "", 20, 90);
    doc.text(client.address || "", 20, 100);
    
    // Add invoice dates
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, 120);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 130);
    
    // Add amount details
    doc.text("Amount Details:", 20, 150);
    doc.text(`Description: ${invoice.description}`, 20, 160);
    doc.text(`Total Amount: ${formatCurrency(invoice.amount)}`, 20, 170);
    
    // Add payment history if any
    if (payments.length > 0) {
      doc.text("Payment History:", 20, 190);
      payments.forEach((payment, index) => {
        const yPos = 200 + (index * 10);
        doc.text(
          `${new Date(payment.date).toLocaleDateString()} - ${formatCurrency(payment.amountPaid)} via ${payment.paymentMethod}`,
          20,
          yPos
        );
      });
    }
    
    // Save the PDF
    doc.save(`invoice-${invoice.id.toString().padStart(4, '0')}.pdf`);
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      className="gap-2"
    >
      <FileDown className="h-4 w-4" />
      Download PDF
    </Button>
  );
};

export default DownloadInvoicePDF;

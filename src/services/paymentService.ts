
import { Payment } from '../types';
import { getInvoiceById, updateInvoiceStatus } from './invoiceService';

// Mock data
let payments: Payment[] = [
  {
    id: 1,
    invoiceId: 2,
    amountPaid: 800.00,
    paymentMethod: 'credit card',
    date: '2023-11-10',
    time: '14:30'
  }
];

export const getPaymentsByInvoiceId = async (invoiceId: number): Promise<Payment[]> => {
  return payments.filter(payment => payment.invoiceId === invoiceId);
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  const newPayment = {
    ...payment,
    id: payments.length + 1,
  };
  
  payments.push(newPayment);
  
  // Get the invoice
  const invoice = await getInvoiceById(payment.invoiceId);
  
  if (invoice) {
    // Calculate total payments for this invoice
    const invoicePayments = await getPaymentsByInvoiceId(payment.invoiceId);
    const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amountPaid, 0);
    
    // If total paid equals or exceeds the invoice amount, mark as paid
    if (totalPaid >= invoice.amount) {
      await updateInvoiceStatus(payment.invoiceId, 'paid');
    }
  }
  
  return newPayment;
};

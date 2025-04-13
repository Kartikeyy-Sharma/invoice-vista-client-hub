
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '../types';
import { getInvoiceById, updateInvoiceStatus } from './invoiceService';

export const getPaymentsByInvoiceId = async (invoiceId: number): Promise<Payment[]> => {
  try {
    console.log(`Fetching payments for invoice ID: ${invoiceId}`);
    
    // Mock data for demonstration
    if (invoiceId === 101) {
      return [
        {
          id: 301,
          invoiceId: 101,
          amountPaid: 500.00,
          paymentMethod: 'credit card',
          date: '2025-04-05',
          time: '14:30:00'
        },
        {
          id: 302,
          invoiceId: 101,
          amountPaid: 500.00,
          paymentMethod: 'bank transfer',
          date: '2025-04-10',
          time: '10:45:00'
        }
      ];
    } else if (invoiceId === 102) {
      return [];
    }
    
    return [];
  } catch (error) {
    console.error('Error in getPaymentsByInvoiceId:', error);
    return [];
  }
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  try {
    console.log('Creating new payment:', payment);
    
    // In a real implementation, this would insert into the database
    // For now, we'll just mock a response with an ID
    const newPayment: Payment = {
      id: Math.floor(Math.random() * 1000) + 300,
      ...payment
    };
    
    // If this payment completes the invoice amount, update the invoice status
    const invoice = await getInvoiceById(payment.invoiceId);
    if (invoice) {
      const existingPayments = await getPaymentsByInvoiceId(payment.invoiceId);
      const totalPaid = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0) + payment.amountPaid;
      
      if (totalPaid >= invoice.amount) {
        await updateInvoiceStatus(payment.invoiceId, 'paid');
      }
    }
    
    return newPayment;
  } catch (error) {
    console.error('Error in createPayment:', error);
    throw error;
  }
};

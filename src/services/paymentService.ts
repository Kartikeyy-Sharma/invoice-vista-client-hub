
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '../types';
import { getInvoiceById, updateInvoiceStatus } from './invoiceService';

export const getPaymentsByInvoiceId = async (invoiceId: number): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (error || !data) return [];

    return data.map(payment => ({
      id: payment.id,
      invoiceId: payment.invoice_id,
      amountPaid: payment.amount_paid,
      paymentMethod: payment.payment_method as 'credit card' | 'bank transfer' | 'UPI',
      date: payment.date,
      time: payment.time
    }));
  } catch (error) {
    console.error('Error in getPaymentsByInvoiceId:', error);
    return [];
  }
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        invoice_id: payment.invoiceId,
        amount_paid: payment.amountPaid,
        payment_method: payment.paymentMethod,
        date: payment.date,
        time: payment.time
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error('Failed to create payment');
    }

    // Check if this payment completes the invoice amount
    const invoice = await getInvoiceById(payment.invoiceId);
    if (invoice) {
      const existingPayments = await getPaymentsByInvoiceId(payment.invoiceId);
      const totalPaid = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0) + payment.amountPaid;
      
      if (totalPaid >= invoice.amount) {
        await updateInvoiceStatus(payment.invoiceId, 'paid');
      }
    }

    return {
      id: data.id,
      invoiceId: data.invoice_id,
      amountPaid: data.amount_paid,
      paymentMethod: data.payment_method as 'credit card' | 'bank transfer' | 'UPI',
      date: data.date,
      time: data.time
    };
  } catch (error) {
    console.error('Error in createPayment:', error);
    throw error;
  }
};

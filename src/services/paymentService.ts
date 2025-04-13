
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '../types';
import { getInvoiceById, updateInvoiceStatus } from './invoiceService';

export const getPaymentsByInvoiceId = async (invoiceId: number): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId);
    
    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
    
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
    
    if (error) {
      console.error('Error creating payment:', error);
      throw new Error(error.message);
    }
    
    // The trigger in the database will automatically update the invoice status if needed
    
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

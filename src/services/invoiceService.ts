
import { supabase } from '@/integrations/supabase/client';
import { Client, Invoice, Notification } from '@/types';

export const getClientById = async (clientId: number): Promise<Client | undefined> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error || !data) {
      console.error('Error in getClientById:', error);
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      company: data.company || ''
    };
  } catch (error) {
    console.error('Error in getClientById:', error);
    return undefined;
  }
};

export const getInvoicesByClientId = async (clientId: number): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId);

    if (error) {
      console.error('Error in getInvoicesByClientId:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(invoice => ({
      id: invoice.id,
      clientId: invoice.client_id,
      amount: invoice.amount,
      dueDate: invoice.due_date,
      issueDate: invoice.issue_date,
      status: invoice.status as 'pending' | 'paid' | 'overdue',
      description: invoice.description || ''
    }));
  } catch (error) {
    console.error('Error in getInvoicesByClientId:', error);
    return [];
  }
};

export const getInvoiceById = async (invoiceId: number): Promise<Invoice | undefined> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !data) {
      console.error('Error in getInvoiceById:', error);
      return undefined;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      amount: data.amount,
      dueDate: data.due_date,
      issueDate: data.issue_date,
      status: data.status as 'pending' | 'paid' | 'overdue',
      description: data.description || ''
    };
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    return undefined;
  }
};

export const getNotificationByInvoiceId = async (invoiceId: number): Promise<Notification | undefined> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('invoice_id', invoiceId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error in getNotificationByInvoiceId:', error);
      return undefined;
    }

    return {
      id: data.id,
      invoiceId: data.invoice_id,
      status: data.status as 'sent' | 'pending',
      date: data.date,
      channel: data.channel as 'email' | 'sms'
    };
  } catch (error) {
    console.error('Error in getNotificationByInvoiceId:', error);
    return undefined;
  }
};

export const updateInvoiceStatus = async (invoiceId: number, status: 'pending' | 'paid' | 'overdue'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error in updateInvoiceStatus:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateInvoiceStatus:', error);
    return false;
  }
};

// Function to create a test invoice (for debugging)
export const createTestInvoice = async (clientId: number): Promise<Invoice | undefined> => {
  try {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        client_id: clientId,
        amount: 999.99,
        issue_date: today.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        status: 'pending',
        description: 'Test invoice'
      })
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error creating test invoice:', error);
      return undefined;
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      amount: data.amount,
      dueDate: data.due_date,
      issueDate: data.issue_date,
      status: data.status as 'pending' | 'paid' | 'overdue',
      description: data.description || ''
    };
  } catch (error) {
    console.error('Error creating test invoice:', error);
    return undefined;
  }
};


import { supabase } from '@/integrations/supabase/client';
import { Invoice, Notification, Client } from '@/types';

export const getClientById = async (clientId: number): Promise<Client | undefined> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single() as unknown as { 
        data: { 
          id: number; 
          name: string; 
          email: string; 
          phone: string; 
          address: string; 
          company: string 
        } | null; 
        error: any 
      };
    
    if (error) {
      console.error('Error fetching client:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company: data.company
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
      .eq('client_id', clientId) as unknown as { 
        data: { 
          id: number; 
          client_id: number; 
          amount: number; 
          due_date: string; 
          issue_date: string; 
          status: 'pending' | 'paid' | 'overdue'; 
          description: string 
        }[] | null; 
        error: any 
      };
    
    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
    
    if (!data) return [];
    
    return data.map(invoice => ({
      id: invoice.id,
      clientId: invoice.client_id,
      amount: invoice.amount,
      dueDate: invoice.due_date,
      issueDate: invoice.issue_date,
      status: invoice.status as 'pending' | 'paid' | 'overdue',
      description: invoice.description
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
      .single() as unknown as { 
        data: { 
          id: number; 
          client_id: number; 
          amount: number; 
          due_date: string; 
          issue_date: string; 
          status: 'pending' | 'paid' | 'overdue'; 
          description: string 
        } | null; 
        error: any 
      };
    
    if (error) {
      console.error('Error fetching invoice:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      clientId: data.client_id,
      amount: data.amount,
      dueDate: data.due_date,
      issueDate: data.issue_date,
      status: data.status as 'pending' | 'paid' | 'overdue',
      description: data.description
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
      .single() as unknown as { 
        data: { 
          id: number; 
          invoice_id: number; 
          status: 'sent' | 'pending'; 
          date: string; 
          channel: 'email' | 'sms'
        } | null; 
        error: any 
      };
    
    if (error) {
      console.error('Error fetching notification:', error);
      return undefined;
    }
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      invoiceId: data.invoice_id,
      status: data.status as 'sent' | 'pending',
      date: data.date || '',
      channel: data.channel as 'email' | 'sms'
    };
  } catch (error) {
    console.error('Error in getNotificationByInvoiceId:', error);
    return undefined;
  }
};

export const updateInvoiceStatus = async (invoiceId: number, status: 'pending' | 'paid' | 'overdue'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({ status } as any)
      .eq('id', invoiceId) as unknown as { error: any };
    
    if (error) {
      console.error('Error updating invoice status:', error);
    }
  } catch (error) {
    console.error('Error in updateInvoiceStatus:', error);
  }
};

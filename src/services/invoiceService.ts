
import { supabase } from '@/integrations/supabase/client';
import { Invoice, Notification, Client } from '@/types';

export const getClientById = async (clientId: number): Promise<Client | undefined> => {
  try {
    console.log(`Fetching client with ID: ${clientId}`);
    
    // Mock data for demonstration
    if (clientId === 1) {
      return {
        id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '555-123-4567',
        address: '123 Business Ave, Suite 100, City, ST 12345',
        company: 'Acme Corporation'
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Error in getClientById:', error);
    return undefined;
  }
};

export const getInvoicesByClientId = async (clientId: number): Promise<Invoice[]> => {
  try {
    console.log(`Fetching invoices for client ID: ${clientId}`);
    
    // Mock data for demonstration
    if (clientId === 1) {
      return [
        {
          id: 101,
          clientId: 1,
          amount: 1500.00,
          dueDate: '2025-05-15',
          issueDate: '2025-04-01',
          status: 'pending',
          description: 'Website development services - April 2025'
        },
        {
          id: 102,
          clientId: 1,
          amount: 800.00,
          dueDate: '2025-04-30',
          issueDate: '2025-04-10',
          status: 'overdue',
          description: 'Maintenance services - March 2025'
        }
      ];
    }
    
    return [];
  } catch (error) {
    console.error('Error in getInvoicesByClientId:', error);
    return [];
  }
};

export const getInvoiceById = async (invoiceId: number): Promise<Invoice | undefined> => {
  try {
    console.log(`Fetching invoice with ID: ${invoiceId}`);
    
    // Mock data for demonstration
    if (invoiceId === 101) {
      return {
        id: 101,
        clientId: 1,
        amount: 1500.00,
        dueDate: '2025-05-15',
        issueDate: '2025-04-01',
        status: 'pending',
        description: 'Website development services - April 2025'
      };
    } else if (invoiceId === 102) {
      return {
        id: 102,
        clientId: 1,
        amount: 800.00,
        dueDate: '2025-04-30',
        issueDate: '2025-04-10',
        status: 'overdue',
        description: 'Maintenance services - March 2025'
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    return undefined;
  }
};

export const getNotificationByInvoiceId = async (invoiceId: number): Promise<Notification | undefined> => {
  try {
    console.log(`Fetching notification for invoice ID: ${invoiceId}`);
    
    // Mock data for demonstration
    if (invoiceId === 101) {
      return {
        id: 201,
        invoiceId: 101,
        status: 'sent',
        date: '2025-04-02',
        channel: 'email'
      };
    } else if (invoiceId === 102) {
      return {
        id: 202,
        invoiceId: 102,
        status: 'pending',
        date: '2025-04-11',
        channel: 'sms'
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Error in getNotificationByInvoiceId:', error);
    return undefined;
  }
};

export const updateInvoiceStatus = async (invoiceId: number, status: 'pending' | 'paid' | 'overdue'): Promise<void> => {
  try {
    console.log(`Updating invoice ${invoiceId} status to: ${status}`);
    // In a real implementation, this would update the database
  } catch (error) {
    console.error('Error in updateInvoiceStatus:', error);
  }
};

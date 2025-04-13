
import { Invoice, Notification, Client } from '../types';

// Mock data
const clients: Client[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
    company: 'ABC Corporation'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    address: '456 Oak Ave, Town, Country',
    company: 'XYZ Enterprises'
  }
];

const invoices: Invoice[] = [
  {
    id: 1,
    clientId: 1,
    amount: 1500.00,
    dueDate: '2023-12-15',
    issueDate: '2023-11-15',
    status: 'pending',
    description: 'Website development services'
  },
  {
    id: 2,
    clientId: 1,
    amount: 800.00,
    dueDate: '2023-11-20',
    issueDate: '2023-11-01',
    status: 'paid',
    description: 'Logo design and branding'
  },
  {
    id: 3,
    clientId: 1,
    amount: 350.00,
    dueDate: '2023-10-30',
    issueDate: '2023-10-15',
    status: 'overdue',
    description: 'Server maintenance'
  },
  {
    id: 4,
    clientId: 2,
    amount: 2200.00,
    dueDate: '2023-12-20',
    issueDate: '2023-11-20',
    status: 'pending',
    description: 'Mobile app development'
  }
];

const notifications: Notification[] = [
  {
    id: 1,
    invoiceId: 1,
    status: 'sent',
    date: '2023-11-15',
    channel: 'email'
  },
  {
    id: 2,
    invoiceId: 2,
    status: 'sent',
    date: '2023-11-01',
    channel: 'email'
  },
  {
    id: 3,
    invoiceId: 3,
    status: 'sent',
    date: '2023-10-15',
    channel: 'email'
  },
  {
    id: 4,
    invoiceId: 4,
    status: 'pending',
    date: '',
    channel: 'email'
  }
];

export const getClientById = async (clientId: number): Promise<Client | undefined> => {
  return clients.find(client => client.id === clientId);
};

export const getInvoicesByClientId = async (clientId: number): Promise<Invoice[]> => {
  return invoices.filter(invoice => invoice.clientId === clientId);
};

export const getInvoiceById = async (invoiceId: number): Promise<Invoice | undefined> => {
  return invoices.find(invoice => invoice.id === invoiceId);
};

export const getNotificationByInvoiceId = async (invoiceId: number): Promise<Notification | undefined> => {
  return notifications.find(notification => notification.invoiceId === invoiceId);
};

export const updateInvoiceStatus = async (invoiceId: number, status: 'pending' | 'paid' | 'overdue'): Promise<void> => {
  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (invoice) {
    invoice.status = status;
  }
};

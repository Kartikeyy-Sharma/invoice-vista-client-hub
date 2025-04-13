
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

export interface Invoice {
  id: number;
  clientId: number;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amountPaid: number;
  paymentMethod: 'credit card' | 'bank transfer' | 'UPI';
  date: string;
  time: string;
}

export interface Notification {
  id: number;
  invoiceId: number;
  status: 'sent' | 'pending';
  date: string;
  channel: 'email' | 'sms';
}

export interface User {
  id: number;
  username: string;
  clientId: number;
}

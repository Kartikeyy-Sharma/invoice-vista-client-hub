
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ClientInfo from '@/components/dashboard/ClientInfo';
import InvoiceList from '@/components/dashboard/InvoiceList';
import { Client, Invoice, Notification } from '@/types';
import { getCurrentUser } from '@/services/authService';
import { getClientById, getInvoicesByClientId, getNotificationByInvoiceId } from '@/services/invoiceService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Record<number, Notification | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch client info
        const clientData = await getClientById(user.clientId);
        if (clientData) {
          setClient(clientData);
        }
        
        // Fetch invoices
        const invoicesData = await getInvoicesByClientId(user.clientId);
        setInvoices(invoicesData);
        
        // Fetch notifications for each invoice
        const notificationsData: Record<number, Notification | undefined> = {};
        for (const invoice of invoicesData) {
          const notification = await getNotificationByInvoiceId(invoice.id);
          notificationsData[invoice.id] = notification;
        }
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-muted-foreground mt-2">Could not load client information.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <ClientInfo client={client} />
        <InvoiceList invoices={invoices} notifications={notifications} />
      </div>
    </Layout>
  );
};

export default Dashboard;

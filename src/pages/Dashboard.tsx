
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import ClientInfo from '@/components/dashboard/ClientInfo';
import InvoiceList from '@/components/dashboard/InvoiceList';
import { Client, Invoice, Notification } from '@/types';
import { getCurrentUser } from '@/services/authService';
import { getClientById, getInvoicesByClientId, getNotificationByInvoiceId, createTestInvoice } from '@/services/invoiceService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Record<number, Notification | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [testInvoice, setTestInvoice] = useState({
    amount: 999.99,
    description: 'Test invoice',
    dueInDays: 30
  });

  const fetchData = async () => {
    setLoading(true);
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
      } else {
        toast.error("Could not load client information");
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
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleCreateTestInvoice = async () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const newInvoice = await createTestInvoice(
        user.clientId,
        testInvoice.amount,
        testInvoice.description,
        testInvoice.dueInDays
      );
      
      if (newInvoice) {
        toast.success("Test invoice created successfully");
        setOpenDialog(false);
        // Refresh the data
        fetchData();
      } else {
        toast.error("Failed to create test invoice");
      }
    } catch (error) {
      console.error('Error creating test invoice:', error);
      toast.error("Error creating test invoice");
    }
  };

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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Invoice
          </Button>
        </div>
        <ClientInfo client={client} />
        <InvoiceList invoices={invoices} notifications={notifications} />
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Test Invoice</DialogTitle>
              <DialogDescription>
                Add details for your test invoice. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={testInvoice.amount}
                  onChange={(e) => setTestInvoice({...testInvoice, amount: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueInDays" className="text-right">
                  Due in (days)
                </Label>
                <Input
                  id="dueInDays"
                  type="number"
                  value={testInvoice.dueInDays}
                  onChange={(e) => setTestInvoice({...testInvoice, dueInDays: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={testInvoice.description}
                  onChange={(e) => setTestInvoice({...testInvoice, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTestInvoice}>Create Invoice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Dashboard;

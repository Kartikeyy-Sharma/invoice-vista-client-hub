
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InvoiceDetailsComponent from '@/components/invoices/InvoiceDetails';
import PaymentHistory from '@/components/invoices/PaymentHistory';
import PaymentForm from '@/components/payments/PaymentForm';
import { Invoice, Client, Payment } from '@/types';
import { getCurrentUser } from '@/services/authService';
import { getInvoiceById, getClientById } from '@/services/invoiceService';
import { getPaymentsByInvoiceId } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async (invoiceId: number) => {
    try {
      const paymentsData = await getPaymentsByInvoiceId(invoiceId);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (!id) {
        navigate('/dashboard');
        return;
      }
      
      try {
        const invoiceId = parseInt(id, 10);
        
        // Fetch invoice details
        const invoiceData = await getInvoiceById(invoiceId);
        if (!invoiceData) {
          navigate('/dashboard');
          return;
        }
        
        // Make sure the invoice belongs to the logged-in client
        if (invoiceData.clientId !== user.clientId) {
          navigate('/dashboard');
          return;
        }
        
        setInvoice(invoiceData);
        
        // Fetch client info
        const clientData = await getClientById(user.clientId);
        if (clientData) {
          setClient(clientData);
        }
        
        // Fetch payment history
        await fetchPayments(invoiceId);
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  const handlePaymentComplete = async () => {
    if (invoice) {
      fetchPayments(invoice.id);
      
      // Refresh invoice to get updated status
      const updatedInvoice = await getInvoiceById(invoice.id);
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
      }
    }
  };

  const calculateTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading invoice details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invoice || !client) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-muted-foreground mt-2">Could not load invoice details.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Invoice Details</h1>
        </div>
        
        <InvoiceDetailsComponent invoice={invoice} client={client} />
        <PaymentHistory payments={payments} invoiceAmount={invoice.amount} />
        {invoice.status !== 'paid' && (
          <PaymentForm 
            invoiceId={invoice.id} 
            invoiceAmount={invoice.amount} 
            totalPaid={calculateTotalPaid()}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDetails;

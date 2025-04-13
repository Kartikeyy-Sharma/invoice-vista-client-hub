
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice, Client } from '@/types';
import StatusBadge from '../dashboard/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, FileText, DollarSign, ClipboardList } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: Invoice;
  client: Client;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, client }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Invoice #{invoice.id.toString().padStart(4, '0')}
        </CardTitle>
        <StatusBadge status={invoice.status} />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Billed To</h3>
                <div className="mt-1">
                  <p className="font-medium">{client.name}</p>
                  <p>{client.company}</p>
                  <p>{client.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{invoice.description}</p>
              </div>
            </div>
            
            {/* Dates and amount */}
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">Issue Date:</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">Due Date:</span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-lg font-semibold">Amount Due</span>
                </div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(invoice.amount)}</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold">Invoice Details</h3>
            </div>
            <div className="mt-3 bg-muted rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-muted-foreground/10">
                    <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">Description</th>
                    <th className="py-2 px-4 text-right text-sm font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 border-t border-muted-foreground/20">{invoice.description}</td>
                    <td className="py-3 px-4 text-right border-t border-muted-foreground/20">{formatCurrency(invoice.amount)}</td>
                  </tr>
                  <tr className="bg-muted-foreground/5">
                    <td className="py-3 px-4 font-medium">Total</td>
                    <td className="py-3 px-4 text-right font-bold">{formatCurrency(invoice.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;

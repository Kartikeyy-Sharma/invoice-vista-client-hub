
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Invoice, Notification } from '@/types';
import StatusBadge from './StatusBadge';
import { Eye, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface InvoiceListProps {
  invoices: Invoice[];
  notifications: Record<number, Notification | undefined>;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, notifications }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Your Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invoices found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {formatCurrency(invoice.amount).replace('₹', '')}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={invoice.description}>
                    {invoice.description}
                  </TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {invoice.status === 'pending' && isOverdue(invoice.dueDate) && (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {formatDate(invoice.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    {notifications[invoice.id]?.status === 'sent' ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/invoice/${invoice.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceList;

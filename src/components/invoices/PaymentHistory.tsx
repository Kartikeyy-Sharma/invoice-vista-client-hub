
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Clock, CreditCard } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
  invoiceAmount: number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, invoiceAmount }) => {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const remaining = Math.max(0, invoiceAmount - totalPaid);
  const percentage = invoiceAmount > 0 ? (totalPaid / invoiceAmount) * 100 : 0;

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'UPI':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span className="font-medium">{percentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Paid: {formatCurrency(totalPaid)}</span>
              <span>Remaining: {formatCurrency(remaining)}</span>
            </div>
          </div>

          {/* Payment list */}
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment records found
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-muted p-4 rounded-lg flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="ml-2 font-medium capitalize">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{payment.date} at {payment.time}</span>
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(payment.amountPaid)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;

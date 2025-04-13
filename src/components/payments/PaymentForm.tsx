
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createPayment } from '@/services/paymentService';

interface PaymentFormProps {
  invoiceId: number;
  invoiceAmount: number;
  totalPaid: number;
  onPaymentComplete: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  invoiceId, 
  invoiceAmount, 
  totalPaid,
  onPaymentComplete 
}) => {
  const remaining = Math.max(0, invoiceAmount - totalPaid);
  const [amount, setAmount] = useState(remaining.toString());
  const [paymentMethod, setPaymentMethod] = useState<'credit card' | 'bank transfer' | 'UPI'>('credit card');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountPaid = parseFloat(amount);
      
      if (isNaN(amountPaid) || amountPaid <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid amount",
          description: "Please enter a valid payment amount",
        });
        return;
      }
      
      if (amountPaid > remaining) {
        toast({
          variant: "destructive",
          title: "Amount exceeds remaining balance",
          description: `The maximum payment amount is ${remaining.toFixed(2)}`,
        });
        return;
      }
      
      // Get current date and time
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].substring(0, 5);
      
      await createPayment({
        invoiceId,
        amountPaid,
        paymentMethod,
        date,
        time,
      });
      
      toast({
        title: "Payment successful",
        description: `Your payment of $${amountPaid.toFixed(2)} has been processed.`,
      });
      
      // Refresh payment history
      onPaymentComplete();
      
      // Reset form if partial payment
      if (amountPaid < remaining) {
        setAmount((remaining - amountPaid).toFixed(2));
      } else {
        setAmount('0');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "An error occurred while processing your payment",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          Make a Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="payment-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remaining}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Remaining balance: ${remaining.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as any)}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit card">Credit Card</SelectItem>
                  <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Secure payment processing
        </div>
        <Button 
          type="submit"
          form="payment-form"
          disabled={loading || remaining <= 0}
        >
          {loading ? "Processing..." : "Make Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;

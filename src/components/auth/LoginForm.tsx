
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertCircle, UserPlus } from 'lucide-react';
import { login, setCurrentUser } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onSwitchMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the username to find the corresponding user profile
      const user = await login(username, password);
      
      if (user) {
        setCurrentUser(user);
        toast({
          title: "Login successful",
          description: "Welcome back to your invoice dashboard!",
        });
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please check your credentials and try again.",
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Login to InvoiceVista</CardTitle>
        <CardDescription className="text-center">
          Enter your username and password to access your invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center justify-center w-full">
          <Button variant="outline" onClick={onSwitchMode} className="w-full" type="button">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center w-full">
          For demo: Use username "client1" and password "password1"
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

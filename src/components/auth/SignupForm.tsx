
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { login, setCurrentUser } from '@/services/authService';

interface SignupFormProps {
  onSwitchMode: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // First create a client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{ 
          name: companyName,
          email: email,
        }])
        .select('id')
        .single();

      if (clientError) {
        throw new Error(clientError.message);
      }

      if (!clientData) {
        throw new Error('Failed to create client record');
      }

      // Then create a user record
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          username: username,
          password: password,
          client_id: clientData.id
        }]);

      if (userError) {
        // If user creation fails, clean up the client we just created
        await supabase.from('clients').delete().eq('id', clientData.id);
        throw new Error(userError.message);
      }

      // Log the user in
      const user = await login(username, password);
      
      if (user) {
        setCurrentUser(user);
        toast({
          title: "Registration successful",
          description: "Welcome to InvoiceVista!",
        });
        navigate('/dashboard');
      } else {
        throw new Error('Auto-login after signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message || "An unexpected error occurred. Please try again.",
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
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Register for an InvoiceVista account
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
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signupUsername">Username</Label>
              <Input 
                id="signupUsername"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signupPassword">Password</Label>
              <Input 
                id="signupPassword"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center w-full">
          <Button variant="outline" onClick={onSwitchMode} className="w-full" type="button">
            <LogIn className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;

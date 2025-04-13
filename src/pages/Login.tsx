
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { getCurrentUser } from '@/services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-primary">InvoiceVista</h1>
        <p className="text-center text-muted-foreground mb-8">
          Client Invoice and Payment Management System
        </p>
        
        {authMode === 'login' ? (
          <LoginForm onSwitchMode={() => setAuthMode('signup')} />
        ) : (
          <SignupForm onSwitchMode={() => setAuthMode('login')} />
        )}
      </div>
    </div>
  );
};

export default Login;

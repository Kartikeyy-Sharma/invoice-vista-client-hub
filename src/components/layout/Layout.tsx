
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, CreditCard, FileText, Home } from 'lucide-react';
import { logout } from '@/services/authService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <h1 className="text-xl font-bold">InvoiceVista</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-white hover:bg-primary/80">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-2">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-primary"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-primary"
              onClick={() => navigate('/dashboard')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Invoices
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold">InvoiceVista</h2>
              <p className="text-sm text-gray-400">Your Client Invoice and Payment Management System</p>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} InvoiceVista. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

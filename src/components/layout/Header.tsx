
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, PlusCircle, BarChart3, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6" />
            <span className="font-medium text-lg">Nightlife Tracker</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/create" 
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Event</span>
              </Link>
              <Link 
                to="/reports" 
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </Link>
            </nav>
            
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline">
                  {currentUser.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            )}
            
            <div className="md:hidden">
              <nav className="flex items-center space-x-4">
                <Link to="/" aria-label="Dashboard">
                  <Home className="h-5 w-5" />
                </Link>
                <Link to="/create" aria-label="Create Event">
                  <PlusCircle className="h-5 w-5" />
                </Link>
                <Link to="/reports" aria-label="Reports">
                  <BarChart3 className="h-5 w-5" />
                </Link>
                {currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="p-0"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

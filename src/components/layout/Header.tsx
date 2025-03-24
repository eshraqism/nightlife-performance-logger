
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, PlusCircle, BarChart3, Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6" />
            <span className="font-medium text-lg">Nightlife Tracker</span>
          </Link>
          
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
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

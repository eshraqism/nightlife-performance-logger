
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { getEvents } from '../utils/localStorage';
import { Event } from '../types';
import Container from '../components/layout/Container';
import EventCard from '../components/ui/EventCard';
import { formatCurrency } from '../utils/calculations';

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from localStorage
    const loadedEvents = getEvents();
    setEvents(loadedEvents);
    setLoading(false);
  }, []);

  // Calculate total revenue across all events
  const totalRevenue = events.reduce((sum, event) => {
    return sum + event.eventData.reduce((eventSum, data) => eventSum + data.totalRevenue, 0);
  }, 0);

  // Get recent events (last 5)
  const recentEvents = [...events].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  return (
    <Container>
      <div className="py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your nightlife events
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link 
              to="/create" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
            <Link 
              to="/reports" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Events</h3>
              <div className="rounded-full p-2 bg-muted">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total events created
              </p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Revenue</h3>
              <div className="rounded-full p-2 bg-muted">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all events
              </p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Average Revenue</h3>
              <div className="rounded-full p-2 bg-muted">
                <ChartIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">
                {events.length > 0 
                  ? formatCurrency(totalRevenue / events.length) 
                  : formatCurrency(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Per event
              </p>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <h3 className="font-medium text-lg mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first event to start tracking your nightlife business
              </p>
              <Link 
                to="/create" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          
          {events.length > 5 && (
            <div className="mt-6 text-center">
              <Link 
                to="/reports" 
                className="text-sm font-medium text-primary hover:underline"
              >
                View all events
              </Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

// Helper icon component for the dashboard
const Calendar = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

export default Index;

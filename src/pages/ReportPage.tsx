
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Search,
  Loader2
} from 'lucide-react';
import Container from '../components/layout/Container';
import { getEvents } from '../utils/localStorage';
import { Event } from '../types';
import { calculateProfit, formatCurrency } from '../utils/calculations';
import EventCard from '../components/ui/EventCard';

const ReportPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'revenue' | 'profit'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    // Load events from localStorage
    const loadedEvents = getEvents();
    setEvents(loadedEvents);
    setLoading(false);
  }, []);
  
  // Calculate total profit for an event (across all event data entries)
  const calculateTotalProfit = (event: Event): number => {
    return event.eventData.reduce((sum, data) => sum + calculateProfit(event, data), 0);
  };
  
  // Calculate total revenue for an event (across all event data entries)
  const calculateTotalRevenue = (event: Event): number => {
    return event.eventData.reduce((sum, data) => sum + data.totalRevenue, 0);
  };
  
  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'revenue') {
        const revenueA = calculateTotalRevenue(a);
        const revenueB = calculateTotalRevenue(b);
        return sortOrder === 'asc' ? revenueA - revenueB : revenueB - revenueA;
      } else if (sortBy === 'profit') {
        const profitA = calculateTotalProfit(a);
        const profitB = calculateTotalProfit(b);
        return sortOrder === 'asc' ? profitA - profitB : profitB - profitA;
      }
      return 0;
    });
  
  // Calculate summary statistics
  const totalRevenue = events.reduce((sum, event) => sum + calculateTotalRevenue(event), 0);
  const totalProfit = events.reduce((sum, event) => sum + calculateTotalProfit(event), 0);
  const averageProfit = events.length > 0 ? totalProfit / events.length : 0;
  
  // Most profitable event
  const mostProfitableEvent = [...events].sort((a, b) => 
    calculateTotalProfit(b) - calculateTotalProfit(a)
  )[0];
  
  // Most recent event
  const mostRecentEvent = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  // Toggle sort order
  const toggleSort = (field: 'date' | 'revenue' | 'profit') => {
    if (sortBy === field) {
      // Toggle order if already sorting by this field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field with desc order by default
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  return (
    <Container>
      <div className="py-10 space-y-8 animate-fadeIn">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Track performance and analyze trends across all events
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Events</h3>
              <div className="rounded-full p-2 bg-muted">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold">{events.length}</p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Revenue</h3>
              <div className="rounded-full p-2 bg-muted">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Total Profit</h3>
              <div className="rounded-full p-2 bg-muted">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Average Profit</h3>
              <div className="rounded-full p-2 bg-muted">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold">{formatCurrency(averageProfit)}</p>
            </div>
          </div>
        </div>
        
        {/* Event Highlights */}
        {events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {mostProfitableEvent && (
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-medium flex items-center mb-4">
                  <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                  Most Profitable Event
                </h3>
                <p className="text-xl font-semibold mb-1">{mostProfitableEvent.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {mostProfitableEvent.venueName}, {mostProfitableEvent.location}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="font-medium">{formatCurrency(calculateTotalProfit(mostProfitableEvent))}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/event/${mostProfitableEvent.id}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
            
            {mostRecentEvent && (
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-medium flex items-center mb-4">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  Most Recent Event
                </h3>
                <p className="text-xl font-semibold mb-1">{mostRecentEvent.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(mostRecentEvent.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium">{formatCurrency(calculateTotalRevenue(mostRecentEvent))}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/event/${mostRecentEvent.id}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Events List with Filtering and Sorting */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">All Events</h2>
            
            <div className="w-full sm:w-auto flex items-center space-x-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSort('date')}
                  className={`px-3 py-2 text-xs font-medium rounded-md flex items-center ${
                    sortBy === 'date' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Date
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  )}
                </button>
                
                <button
                  onClick={() => toggleSort('revenue')}
                  className={`px-3 py-2 text-xs font-medium rounded-md flex items-center ${
                    sortBy === 'revenue' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Revenue
                  {sortBy === 'revenue' && (
                    sortOrder === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  )}
                </button>
                
                <button
                  onClick={() => toggleSort('profit')}
                  className={`px-3 py-2 text-xs font-medium rounded-md flex items-center ${
                    sortBy === 'profit' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Profit
                  {sortBy === 'profit' && (
                    sortOrder === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAndSortedEvents.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <h3 className="font-medium text-lg mb-2">
                {events.length === 0 ? 'No events found' : 'No matching events'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {events.length === 0 
                  ? 'Create your first event to start tracking your nightlife business'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {events.length === 0 && (
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

const ChevronUpIcon = ({ className }: { className?: string }) => (
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
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default ReportPage;

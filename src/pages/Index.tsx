
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Loader2, 
  Calendar, 
  DollarSign, 
  FileText,
  BellRing,
  Target,
  AlertCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import { getEvents } from '../utils/localStorage';
import { Event } from '../types';
import Container from '../components/layout/Container';
import EventCard from '../components/ui/EventCard';
import { formatCurrency } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { getAllEvents } from '../utils/db';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { calculateTotalExpenses, calculateProfit } from '../utils/calculations';

// Sample data for charts
const timeSeriesData = [
  { month: 'Jan', revenue: 5000, expenses: 3000 },
  { month: 'Feb', revenue: 7000, expenses: 4000 },
  { month: 'Mar', revenue: 9000, expenses: 5000 },
  { month: 'Apr', revenue: 6000, expenses: 3500 },
  { month: 'May', revenue: 8000, expenses: 4500 },
  { month: 'Jun', revenue: 10000, expenses: 6000 },
];

const expenseBreakdownData = [
  { name: 'Venue', value: 35 },
  { name: 'Staff', value: 25 },
  { name: 'Marketing', value: 20 },
  { name: 'Other', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState("monthly");
  const [goalProgress, setGoalProgress] = useState(65); // Sample progress percentage
  const [eventFilter, setEventFilter] = useState("recent");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!currentUser) {
          setEvents([]);
          setLoading(false);
          return;
        }
        
        // Use the async db function directly
        const loadedEvents = await getAllEvents(currentUser.id);
        setEvents(loadedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [currentUser]);

  // Calculate total revenue across all events
  const totalRevenue = events.reduce((sum, event) => {
    return sum + event.eventData.reduce((eventSum, data) => eventSum + data.totalRevenue, 0);
  }, 0);

  // Calculate total expenses
  const totalExpenses = events.reduce((sum, event) => {
    return sum + event.eventData.reduce((eventSum, data) => eventSum + calculateTotalExpenses(data), 0);
  }, 0);

  // Calculate total profit
  const totalProfit = events.reduce((sum, event) => {
    return sum + event.eventData.reduce((eventSum, data) => {
      return eventSum + calculateProfit(event, data);
    }, 0);
  }, 0);

  // Filter events based on the selected filter
  const filteredEvents = () => {
    const sortedEvents = [...events].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    
    switch(eventFilter) {
      case "this-week":
        return sortedEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= oneWeekAgo && eventDate <= oneWeekLater;
        });
      case "upcoming":
        return sortedEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate > today;
        });
      case "past":
        return sortedEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate < today;
        });
      default:
        return sortedEvents.slice(0, 5); // Recent events (last 5)
    }
  };

  // ROI calculation
  const calculateROI = () => {
    if (totalExpenses === 0) return 0;
    return (totalProfit / totalExpenses) * 100;
  };

  // Average spend per event
  const avgSpendPerEvent = events.length > 0 ? totalExpenses / events.length : 0;
  
  // Average profit per event
  const avgProfitPerEvent = events.length > 0 ? totalProfit / events.length : 0;

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
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* 1. Performance Summary Overview */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance Summary</h2>
            <Tabs defaultValue="monthly" value={timeframe} onValueChange={setTimeframe} className="w-fit">
              <TabsList>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+2.5% from last {timeframe.replace('ly', '')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">+0.7% from last {timeframe.replace('ly', '')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
                <p className="text-xs text-muted-foreground">+4.1% from last {timeframe.replace('ly', '')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateROI().toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last {timeframe.replace('ly', '')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Run</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Total events tracked</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Spend/Event</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgSpendPerEvent)}</div>
                <p className="text-xs text-muted-foreground">Expenses per event</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Profit/Event</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgProfitPerEvent)}</div>
                <p className="text-xs text-muted-foreground">Net profit per event</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 2. Progress Tracker / Goal Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Goal</CardTitle>
              <CardDescription>Track your progress against set targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>This month's revenue goal: 12,000 AED</span>
                  <span className="font-medium">7,800 AED achieved (65%)</span>
                </div>
                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 3. Upcoming Tasks / Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Things that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-1">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Add expenses for Friday Night Party</p>
                    <p className="text-sm text-muted-foreground">Due in 2 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-1">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Approve revenue for Skybar event</p>
                    <p className="text-sm text-muted-foreground">Due today</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Mark Beach Club event as completed</p>
                    <p className="text-sm text-muted-foreground">Overdue by 1 day</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* 5. Notifications & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Important updates about your events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">You forgot to add expenses for Friday's event</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">Complete this to get accurate profitability data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-3 rounded-md border border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300">Profit dropped by 20% compared to last week</h4>
                <p className="text-sm text-red-700 dark:text-red-400">Review your expenses to identify potential issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Trend over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={{ revenue: { color: "#0088FE" }, expenses: { color: "#FF8042" } }}>
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <PieChart>
                  <Pie 
                    data={expenseBreakdownData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false}
                    outerRadius={80} 
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* 4. Latest Events Summary */}
        <Card>
          <CardHeader className="space-y-0">
            <div className="flex justify-between items-center">
              <CardTitle>Events Summary</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={eventFilter === "recent" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setEventFilter("recent")}
                >
                  Recent
                </Button>
                <Button 
                  variant={eventFilter === "this-week" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setEventFilter("this-week")}
                >
                  This Week
                </Button>
                <Button 
                  variant={eventFilter === "upcoming" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setEventFilter("upcoming")}
                >
                  Upcoming
                </Button>
                <Button 
                  variant={eventFilter === "past" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setEventFilter("past")}
                >
                  Past
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEvents().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents().map((event) => {
                    const profit = event.eventData.reduce((sum, data) => sum + calculateProfit(event, data), 0);
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const isUpcoming = eventDate > today;
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.venueName}</TableCell>
                        <TableCell className="text-right">
                          <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(profit)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/event/${event.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {events.length > 5 && eventFilter === "recent" && (
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/reports">View All Events</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default Index;

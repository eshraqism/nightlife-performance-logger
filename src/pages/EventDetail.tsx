import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  CalendarPlus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Percent, 
  CreditCard,
  Plus,
  X,
  DollarSign,
  UserPlus,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import Container from '../components/layout/Container';
import { 
  Event, 
  EventData, 
  Promoter, 
  Staff, 
  VipGirl, 
  AdSpend 
} from '../types';
import { 
  getSingleEvent as getEvent, 
  saveEventToDB as saveEvent, 
  deleteEventFromDB as deleteEvent 
} from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { 
  calculateTotalCommissions, 
  calculateTotalExpenses, 
  calculateRumbaRevenue, 
  calculateProfit, 
  formatCurrency 
} from '../utils/calculations';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);
  
  const [formDate, setFormDate] = useState('');
  const [promoters, setPromoters] = useState<Promoter[]>([{ name: '', commission: 0 }]);
  const [staff, setStaff] = useState<Staff[]>([{ role: '', name: '', payment: 0 }]);
  const [tableCommissions, setTableCommissions] = useState(0);
  const [vipGirls, setVipGirls] = useState<VipGirl[]>([{ name: '', commission: 0 }]);
  const [adSpend, setAdSpend] = useState<AdSpend[]>([{ platform: '', amount: 0 }]);
  const [leadsCollected, setLeadsCollected] = useState(0);
  const [doorRevenue, setDoorRevenue] = useState<number | undefined>(undefined);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [tablesFromRumba, setTablesFromRumba] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [daysUntilPaid, setDaysUntilPaid] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    async function loadEvent() {
      if (id && currentUser?.id) {
        try {
          const foundEvent = await getEvent(id);
          if (foundEvent) {
            setEvent(foundEvent);
          } else {
            toast.error('Event not found');
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading event:', error);
          toast.error('Failed to load event data');
        } finally {
          setLoading(false);
        }
      }
    }
    
    loadEvent();
  }, [id, navigate, currentUser]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateSummary = () => {
    if (!event || event.eventData.length === 0) return null;
    
    const totalRevenue = event.eventData.reduce((sum, data) => sum + data.totalRevenue, 0);
    const totalAttendees = event.eventData.reduce((sum, data) => sum + data.totalAttendees, 0);
    const totalTables = event.eventData.reduce((sum, data) => sum + data.tablesFromRumba, 0);
    
    const totalCommissions = event.eventData.reduce((sum, data) => sum + calculateTotalCommissions(data), 0);
    const totalExpenses = event.eventData.reduce((sum, data) => sum + calculateTotalExpenses(data), 0);
    
    const totalProfit = event.eventData.reduce((sum, data) => sum + calculateProfit(event, data), 0);
    
    return {
      totalRevenue,
      totalAttendees,
      totalTables,
      totalCommissions,
      totalExpenses,
      totalProfit
    };
  };
  
  const addPromoter = () => {
    setPromoters([...promoters, { name: '', commission: 0 }]);
  };
  
  const removePromoter = (index: number) => {
    setPromoters(promoters.filter((_, i) => i !== index));
  };
  
  const updatePromoter = (index: number, field: keyof Promoter, value: string | number) => {
    const updatedPromoters = [...promoters];
    updatedPromoters[index] = { 
      ...updatedPromoters[index], 
      [field]: field === 'commission' ? Number(value) : value 
    };
    setPromoters(updatedPromoters);
  };
  
  const addStaff = () => {
    setStaff([...staff, { role: '', name: '', payment: 0 }]);
  };
  
  const removeStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };
  
  const updateStaff = (index: number, field: keyof Staff, value: string | number) => {
    const updatedStaff = [...staff];
    updatedStaff[index] = { 
      ...updatedStaff[index], 
      [field]: field === 'payment' ? Number(value) : value 
    };
    setStaff(updatedStaff);
  };
  
  const addVipGirl = () => {
    setVipGirls([...vipGirls, { name: '', commission: 0 }]);
  };
  
  const removeVipGirl = (index: number) => {
    setVipGirls(vipGirls.filter((_, i) => i !== index));
  };
  
  const updateVipGirl = (index: number, field: keyof VipGirl, value: string | number) => {
    const updatedVipGirls = [...vipGirls];
    updatedVipGirls[index] = { 
      ...updatedVipGirls[index], 
      [field]: field === 'commission' ? Number(value) : value 
    };
    setVipGirls(updatedVipGirls);
  };
  
  const addAdSpend = () => {
    setAdSpend([...adSpend, { platform: '', amount: 0 }]);
  };
  
  const removeAdSpend = (index: number) => {
    setAdSpend(adSpend.filter((_, i) => i !== index));
  };
  
  const updateAdSpend = (index: number, field: keyof AdSpend, value: string | number) => {
    const updatedAdSpend = [...adSpend];
    updatedAdSpend[index] = { 
      ...updatedAdSpend[index], 
      [field]: ['amount', 'reach', 'clicks', 'leads'].includes(field) ? Number(value) : value 
    };
    setAdSpend(updatedAdSpend);
  };
  
  const handleSubmitEventData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !currentUser?.id) return;
    
    setSaving(true);
    
    if (!formDate || totalRevenue <= 0) {
      toast.error('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    const filteredPromoters = promoters.filter(p => p.name.trim() !== '');
    const filteredStaff = staff.filter(s => s.name.trim() !== '');
    const filteredVipGirls = vipGirls.filter(v => v.name.trim() !== '');
    const filteredAdSpend = adSpend.filter(a => a.platform.trim() !== '');
    
    const newEventData: EventData = {
      promoters: filteredPromoters,
      staff: filteredStaff,
      tableCommissions,
      vipGirlsCommissions: filteredVipGirls,
      adSpend: filteredAdSpend,
      leadsCollected,
      doorRevenue: event.dealType === 'Entrance Deal' || event.dealType === 'Both' ? doorRevenue : undefined,
      totalRevenue,
      totalAttendees,
      tablesFromRumba,
      paymentReceived,
      daysUntilPaid: paymentReceived ? daysUntilPaid : undefined,
      date: formDate,
      notes
    };
    
    const updatedEvent = {
      ...event,
      eventData: [...event.eventData, newEventData],
      updatedAt: new Date().toISOString()
    };
    
    try {
      await saveEvent(updatedEvent, currentUser.id);
      setEvent(updatedEvent);
      
      resetForm();
      setShowAddEntryForm(false);
      
      toast.success('Event data added successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event data');
    } finally {
      setSaving(false);
    }
  };
  
  const resetForm = () => {
    setFormDate('');
    setPromoters([{ name: '', commission: 0 }]);
    setStaff([{ role: '', name: '', payment: 0 }]);
    setTableCommissions(0);
    setVipGirls([{ name: '', commission: 0 }]);
    setAdSpend([{ platform: '', amount: 0 }]);
    setLeadsCollected(0);
    setDoorRevenue(undefined);
    setTotalRevenue(0);
    setTotalAttendees(0);
    setTablesFromRumba(0);
    setPaymentReceived(false);
    setDaysUntilPaid(undefined);
    setNotes('');
  };
  
  const handleDeleteEventData = async (index: number) => {
    if (!event || !currentUser?.id) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this event data?');
    if (!confirmed) return;
    
    const updatedEventData = [...event.eventData];
    updatedEventData.splice(index, 1);
    
    const updatedEvent = {
      ...event,
      eventData: updatedEventData,
      updatedAt: new Date().toISOString()
    };
    
    try {
      await saveEvent(updatedEvent, currentUser.id);
      setEvent(updatedEvent);
      toast.success('Event data deleted successfully!');
    } catch (error) {
      console.error('Error deleting event data:', error);
      toast.error('Failed to delete event data');
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!event) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      await deleteEvent(event.id);
      navigate('/');
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };
  
  const EventDataCard = ({ data, index }: { data: EventData; index: number }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className="glass-card rounded-xl divide-y animate-fadeIn">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {formatDate(data.date)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {data.totalAttendees} attendees, {data.tablesFromRumba} tables
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="rounded-full p-2 hover:bg-muted"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleDeleteEventData(index)}
                className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="font-medium">{formatCurrency(data.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className="font-medium">
                {event && formatCurrency(calculateProfit(event, data))}
              </p>
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="p-4 sm:p-6 space-y-4">
            {data.promoters.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Promoters</h4>
                <ul className="space-y-1 text-sm">
                  {data.promoters.map((promoter, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{promoter.name}</span>
                      <span>{formatCurrency(promoter.commission)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.staff.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Staff</h4>
                <ul className="space-y-1 text-sm">
                  {data.staff.map((staffMember, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {staffMember.name} ({staffMember.role})
                      </span>
                      <span>{formatCurrency(staffMember.payment)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.vipGirlsCommissions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">VIP Girls</h4>
                <ul className="space-y-1 text-sm">
                  {data.vipGirlsCommissions.map((girl, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{girl.name}</span>
                      <span>{formatCurrency(girl.commission)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.adSpend.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Ad Spend</h4>
                <ul className="space-y-1 text-sm">
                  {data.adSpend.map((ad, idx) => (
                    <li key={idx} className="flex flex-col">
                      <div className="flex justify-between">
                        <span>{ad.platform}</span>
                        <span>{formatCurrency(ad.amount)}</span>
                      </div>
                      {(ad.reach || ad.clicks || ad.leads) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {ad.reach && <span>Reach: {ad.reach} • </span>}
                          {ad.clicks && <span>Clicks: {ad.clicks} • </span>}
                          {ad.leads && <span>Leads: {ad.leads}</span>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Total Commissions</p>
                <p className="font-medium">
                  {formatCurrency(calculateTotalCommissions(data))}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="font-medium">
                  {formatCurrency(calculateTotalExpenses(data))}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <p className="font-medium">
                  {data.paymentReceived ? 'Received' : 'Pending'}
                </p>
              </div>
              {data.paymentReceived && data.daysUntilPaid !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Days Until Paid</p>
                  <p className="font-medium">{data.daysUntilPaid} days</p>
                </div>
              )}
            </div>
            
            {data.notes && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const summary = calculateSummary();
  
  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }
  
  if (!event) {
    return (
      <Container>
        <div className="py-10">
          <div className="glass-card rounded-xl p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been deleted.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </Container>
    );
  }
  
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
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
              <p className="text-muted-foreground mt-1">
                {formatDate(event.date)} at {event.time}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowAddEntryForm(!showAddEntryForm)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                {showAddEntryForm ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Add Event Data
                  </>
                )}
              </button>
              
              <button
                onClick={handleDeleteEvent}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
                <span className="ml-2">{event.time}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Venue:</span>
                <span className="ml-2">{event.venueName}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{event.location}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Deal Type:</span>
                <span className="ml-2">{event.dealType}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Rumba %:</span>
                <span className="ml-2">{event.rumbaPercentage}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Payment Terms:</span>
                <span className="ml-2">{event.paymentTerms}</span>
              </div>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-start text-sm">
                <Users className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Partners:</span>
                  {event.partners.length === 0 ? (
                    <span className="ml-2">None</span>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {event.partners.map((partner, idx) => (
                        <li key={idx} className="flex items-center">
                          <span>{partner.name}</span>
                          <span className="ml-2 text-muted-foreground">
                            ({partner.percentage}%)
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {summary && (
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-semibold">{formatCurrency(summary.totalProfit)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-semibold">{summary.totalAttendees}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Tables</p>
                <p className="text-2xl font-semibold">{summary.totalTables}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Commissions</p>
                <p className="text-2xl font-semibold">{formatCurrency(summary.totalCommissions)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-semibold">{formatCurrency(summary.totalExpenses)}</p>
              </div>
            </div>
          </div>
        )}
        
        {showAddEntryForm && (
          <form onSubmit={handleSubmitEventData} className="glass-card rounded-xl p-6 space-y-8 animate-slideUp">
            <h2 className="text-xl font-semibold">Add Event Data</h2>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Event Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="formDate" className="text-sm font-medium">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="formDate"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="totalAttendees" className="text-sm font-medium">
                    Total Attendees <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="totalAttendees"
                    type="number"
                    min="0"
                    value={totalAttendees}
                    onChange={(e) => setTotalAttendees(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tablesFromRumba" className="text-sm font-medium">
                    Tables from Rumba <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="tablesFromRumba"
                    type="number"
                    min="0"
                    value={tablesFromRumba}
                    onChange={(e) => setTablesFromRumba(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="leadsCollected" className="text-sm font-medium">
                    Leads Collected
                  </label>
                  <input
                    id="leadsCollected"
                    type="number"
                    min="0"
                    value={leadsCollected}
                    onChange={(e) => setLeadsCollected(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                {event.dealType === 'Entrance Deal' && (
                  <div className="space-y-2">
                    <label htmlFor="doorRevenue" className="text-sm font-medium">
                      Door Revenue <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="doorRevenue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={doorRevenue ?? ''}
                        onChange={(e) => setDoorRevenue(Number(e.target.value))}
                        className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="totalRevenue" className="text-sm font-medium">
                    Total Revenue <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="totalRevenue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={totalRevenue}
                      onChange={(e) => setTotalRevenue(Number(e.target.value))}
                      className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="paymentReceived" className="text-sm font-medium">
                      Payment Received
                    </label>
                    <input
                      id="paymentReceived"
                      type="checkbox"
                      checked={paymentReceived}
                      onChange={(e) => setPaymentReceived(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                {paymentReceived && (
                  <div className="space-y-2">
                    <label htmlFor="daysUntilPaid" className="text-sm font-medium">
                      Days Until Paid
                    </label>
                    <input
                      id="daysUntilPaid"
                      type="number"
                      min="0"
                      value={daysUntilPaid ?? ''}
                      onChange={(e) => setDaysUntilPaid(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Promoters</h3>
                <button
                  type="button"
                  onClick={addPromoter}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Promoter
                </button>
              </div>
              
              <div className="space-y-4">
                {promoters.map((promoter, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                      <label 
                        htmlFor={`promoterName-${index}`} 
                        className="text-sm font-medium"
                      >
                        Promoter Name
                      </label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id={`promoterName-${index}`}
                          type="text"
                          value={promoter.name}
                          onChange={(e) => updatePromoter(index, 'name', e.target.value)}
                          className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Promoter name"
                        />
                      </div>
                    </div>
                    <div className="w-40 space-y-2">
                      <label 
                        htmlFor={`promoterCommission-${index}`} 
                        className="text-sm font-medium"
                      >
                        Commission
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id={`promoterCommission-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={promoter.commission}
                          onChange={(e) => updatePromoter(index, 'commission', e.target.value)}
                          className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePromoter(index)}
                      className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove promoter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Staff</h3>
                <button
                  type="button"
                  onClick={addStaff}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Staff
                </button>
              </div>
              
              <div className="space-y-4">
                {staff.map((staffMember, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="w-1/3 space-y-2">
                      <label 
                        htmlFor={`staffRole-${index}`} 
                        className="text-sm font-medium"
                      >
                        Role
                      </label>
                      <input
                        id={`staffRole-${index}`}
                        type="text"
                        value={staffMember.role}
                        onChange={(e) => updateStaff(index, 'role', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., Photographer"
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <label 
                        htmlFor={`staffName-${index}`} 
                        className="text-sm font-medium"
                      >
                        Name
                      </label>
                      <input
                        id={`staffName-${index}`}
                        type="text"
                        value={staffMember.name}
                        onChange={(e) => updateStaff(index, 'name', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Staff name"
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <label 
                        htmlFor={`staffPayment-${index}`} 
                        className="text-sm font-medium"
                      >
                        Payment
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id={`staffPayment-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={staffMember.payment}
                          onChange={(e) => updateStaff(index, 'payment', e.target.value)}
                          className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStaff(index)}
                      className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove staff"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">Table Commissions</h3>
              
              <div className="space-y-2">
                <label htmlFor="tableCommissions" className="text-sm font-medium">
                  Total Table Commissions
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="tableCommissions"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tableCommissions}
                    onChange={(e) => setTableCommissions(Number(e.target.value))}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">VIP Girls Commissions</h3>
                <button
                  type="button"
                  onClick={addVipGirl}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add VIP Girl
                </button>
              </div>
              
              <div className="space-y-4">
                {vipGirls.map((girl, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                      <label 
                        htmlFor={`vipGirlName-${index}`} 
                        className="text-sm font-medium"
                      >
                        Name
                      </label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id={`vipGirlName-${index}`}
                          type="text"
                          value={girl.name}
                          onChange={(e) => updateVipGirl(index, 'name', e.target.value)}
                          className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="VIP Girl name"
                        />
                      </div>
                    </div>
                    <div className="w-40 space-y-2">
                      <label 
                        htmlFor={`vipGirlCommission-${index}`} 
                        className="text-sm font-medium"
                      >
                        Commission
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id={`vipGirlCommission-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={girl.commission}
                          onChange={(e) => updateVipGirl(index, 'commission', e.target.value)}
                          className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVipGirl(index)}
                      className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove VIP girl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Ad Spend</h3>
                <button
                  type="button"
                  onClick={addAdSpend}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Ad Platform
                </button>
              </div>
              
              <div className="space-y-6">
                {adSpend.map((ad, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-end gap-4">
                      <div className="flex-grow space-y-2">
                        <label 
                          htmlFor={`adPlatform-${index}`} 
                          className="text-sm font-medium"
                        >
                          Platform
                        </label>
                        <input
                          id={`adPlatform-${index}`}
                          type="text"
                          value={ad.platform}
                          onChange={(e) => updateAdSpend(index, 'platform', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="e.g., Instagram, Google"
                        />
                      </div>
                      <div className="w-40 space-y-2">
                        <label 
                          htmlFor={`adAmount-${index}`} 
                          className="text-sm font-medium"
                        >
                          Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            id={`adAmount-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={ad.amount}
                            onChange={(e) => updateAdSpend(index, 'amount', e.target.value)}
                            className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdSpend(index)}
                        className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                        aria-label="Remove ad platform"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pl-4 border-l-2 border-muted ml-2">
                      <div className="space-y-2">
                        <label 
                          htmlFor={`adReach-${index}`} 
                          className="text-sm font-medium"
                        >
                          Reach
                        </label>
                        <input
                          id={`adReach-${index}`}
                          type="number"
                          min="0"
                          value={ad.reach ?? ''}
                          onChange={(e) => updateAdSpend(index, 'reach', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <label 
                          htmlFor={`adClicks-${index}`} 
                          className="text-sm font-medium"
                        >
                          Clicks
                        </label>
                        <input
                          id={`adClicks-${index}`}
                          type="number"
                          min="0"
                          value={ad.clicks ?? ''}
                          onChange={(e) => updateAdSpend(index, 'clicks', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <label 
                          htmlFor={`adLeads-${index}`} 
                          className="text-sm font-medium"
                        >
                          Leads
                        </label>
                        <input
                          id={`adLeads-${index}`}
                          type="number"
                          min="0"
                          value={ad.leads ?? ''}
                          onChange={(e) => updateAdSpend(index, 'leads', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">Notes</h3>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="Any additional notes about this event date..."
                />
              </div>
            </div>
            
            <div className="pt-6 border-t flex justify-end">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEntryForm(false)}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Event Data'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Event Data</h2>
          
          {event.eventData.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-4">
                <Info className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No data entries yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start tracking your event performance by adding data for each event date.
              </p>
              {!showAddEntryForm && (
                <button
                  onClick={() => setShowAddEntryForm(true)}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add Event Data
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {event.eventData.map((data, index) => (
                <EventDataCard key={index} data={data} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EventDetail;

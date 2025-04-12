import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Building, 
  Percent, 
  CreditCard, 
  Users, 
  Plus, 
  Trash2,
  ArrowLeft,
  Tag
} from 'lucide-react';
import Container from '../components/layout/Container';
import { 
  DayOfWeek, 
  DealType, 
  PaymentTerms, 
  Partner,
  Event as EventType
} from '../types';
import { saveEventToDB, generateId } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DEAL_TYPES: DealType[] = ['Revenue Share', 'Entrance Deal', 'Both'];

const PAYMENT_TERMS: PaymentTerms[] = [
  '50% upfront', 'Weekly', 'Bi-weekly', 'Monthly', 'End of month', 'Other'
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Friday');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venueName, setVenueName] = useState('');
  const [location, setLocation] = useState('');
  const [dealType, setDealType] = useState<DealType>('Revenue Share');
  const [rumbaPercentage, setRumbaPercentage] = useState(50);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('50% upfront');
  const [partners, setPartners] = useState<Partner[]>([{ name: '', percentage: 0 }]);
  
  const addPartner = () => {
    setPartners([...partners, { name: '', percentage: 0 }]);
  };
  
  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };
  
  const updatePartner = (index: number, field: keyof Partner, value: string | number) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = { 
      ...updatedPartners[index], 
      [field]: field === 'percentage' ? Number(value) : value 
    };
    setPartners(updatedPartners);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!name || !date || !time || !venueName || !location || !currentUser?.id) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    const filteredPartners = partners.filter(p => p.name.trim() !== '');
    
    const newEvent: EventType = {
      id: generateId(),
      name,
      dayOfWeek,
      date,
      time,
      venueName,
      location,
      dealType,
      rumbaPercentage,
      paymentTerms,
      partners: filteredPartners,
      eventData: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await saveEventToDB(newEvent, currentUser.id);
      toast.success("Event created successfully!");
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <div className="py-10 animate-fadeIn">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-1">
            Add details about your nightlife event
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 glass-card rounded-xl p-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Friday Night Party"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dayOfWeek" className="text-sm font-medium">
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <select
                  id="dayOfWeek"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="venueName" className="text-sm font-medium">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="venueName"
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Skybar"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Downtown Miami"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-xl font-semibold">Deal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="dealType" className="text-sm font-medium">
                  Deal Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    id="dealType"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value as DealType)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    {DEAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="rumbaPercentage" className="text-sm font-medium">
                  Rumba Percentage <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="rumbaPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={rumbaPercentage}
                    onChange={(e) => setRumbaPercentage(Number(e.target.value))}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentTerms" className="text-sm font-medium">
                  Payment Terms <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    id="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    {PAYMENT_TERMS.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Partners Involved</h2>
              <button
                type="button"
                onClick={addPartner}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Partner
              </button>
            </div>
            
            <div className="space-y-4">
              {partners.map((partner, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="flex-grow space-y-2">
                    <label 
                      htmlFor={`partnerName-${index}`} 
                      className="text-sm font-medium"
                    >
                      Partner Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id={`partnerName-${index}`}
                        type="text"
                        value={partner.name}
                        onChange={(e) => updatePartner(index, 'name', e.target.value)}
                        className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., Partner Co."
                      />
                    </div>
                  </div>
                  <div className="w-32 space-y-2">
                    <label 
                      htmlFor={`partnerPercentage-${index}`} 
                      className="text-sm font-medium"
                    >
                      Percentage
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id={`partnerPercentage-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={partner.percentage}
                        onChange={(e) => updatePartner(index, 'percentage', e.target.value)}
                        className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePartner(index)}
                    className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                    aria-label="Remove partner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default CreateEvent;

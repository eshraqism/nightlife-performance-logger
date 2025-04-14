
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Container from '../components/layout/Container';
import { Event, EventData } from '../types';
import { 
  getSingleEvent as getEvent, 
  saveEventToDB as saveEvent, 
  deleteEventFromDB as deleteEvent 
} from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { useEventSummary } from '../hooks/useEventSummary';
import { useFormatDate } from '../hooks/useFormatDate';
import { useEventForm } from '../hooks/useEventForm';

// Import components
import EventDetailHeader from '../components/events/EventDetailHeader';
import EventDetailsCard from '../components/events/EventDetailsCard';
import EventSummaryCard from '../components/events/EventSummaryCard';
import EventDataList from '../components/events/EventDataList';
import EventDataForm from '../components/events/EventDataForm';
import EventDetailLoading from '../components/events/EventDetailLoading';
import EventNotFound from '../components/events/EventNotFound';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);
  
  const formatDate = useFormatDate();
  const summary = useEventSummary(event);
  const formState = useEventForm();
  
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
  
  const handleSubmitEventData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !currentUser?.id) return;
    
    setSaving(true);
    
    if (!formState.formDate || formState.totalRevenue <= 0) {
      toast.error('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    const filteredPromoters = formState.promoters.filter(p => p.name.trim() !== '');
    const filteredStaff = formState.staff.filter(s => s.name.trim() !== '');
    const filteredVipGirls = formState.vipGirls.filter(v => v.name.trim() !== '');
    const filteredAdSpend = formState.adSpend.filter(a => a.platform.trim() !== '');
    
    const newEventData: EventData = {
      promoters: filteredPromoters,
      staff: filteredStaff,
      tableCommissions: formState.tableCommissions,
      vipGirlsCommissions: filteredVipGirls,
      adSpend: filteredAdSpend,
      leadsCollected: formState.leadsCollected,
      doorRevenue: event.dealType === 'Entrance Deal' || event.dealType === 'Revenue Share & Entrance Deal' ? formState.doorRevenue : undefined,
      totalRevenue: formState.totalRevenue,
      totalAttendees: formState.totalAttendees,
      tablesFromRumba: formState.tablesFromRumba,
      paymentReceived: formState.paymentReceived,
      daysUntilPaid: formState.paymentReceived ? formState.daysUntilPaid : undefined,
      date: formState.formDate,
      notes: formState.notes
    };
    
    const updatedEvent = {
      ...event,
      eventData: [...event.eventData, newEventData],
      updatedAt: new Date().toISOString()
    };
    
    try {
      await saveEvent(updatedEvent, currentUser.id);
      setEvent(updatedEvent);
      
      formState.resetForm();
      setShowAddEntryForm(false);
      
      toast.success('Event data added successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event data');
    } finally {
      setSaving(false);
    }
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
  
  if (loading) {
    return <EventDetailLoading />;
  }
  
  if (!event) {
    return <EventNotFound />;
  }
  
  return (
    <Container>
      <div className="py-10 space-y-8 animate-fadeIn">
        <EventDetailHeader 
          event={event}
          showAddEntryForm={showAddEntryForm}
          setShowAddEntryForm={setShowAddEntryForm}
          handleDeleteEvent={handleDeleteEvent}
          formatDate={formatDate}
        />
        
        <EventDetailsCard event={event} formatDate={formatDate} />
        
        <EventSummaryCard summary={summary} />
        
        {showAddEntryForm && (
          <EventDataForm
            event={event}
            saving={saving}
            formDate={formState.formDate}
            setFormDate={formState.setFormDate}
            promoters={formState.promoters}
            setPromoters={formState.setPromoters}
            staff={formState.staff}
            setStaff={formState.setStaff}
            tableCommissions={formState.tableCommissions}
            setTableCommissions={formState.setTableCommissions}
            vipGirls={formState.vipGirls}
            setVipGirls={formState.setVipGirls}
            adSpend={formState.adSpend}
            setAdSpend={formState.setAdSpend}
            leadsCollected={formState.leadsCollected}
            setLeadsCollected={formState.setLeadsCollected}
            doorRevenue={formState.doorRevenue}
            setDoorRevenue={formState.setDoorRevenue}
            totalRevenue={formState.totalRevenue}
            setTotalRevenue={formState.setTotalRevenue}
            totalAttendees={formState.totalAttendees}
            setTotalAttendees={formState.setTotalAttendees}
            tablesFromRumba={formState.tablesFromRumba}
            setTablesFromRumba={formState.setTablesFromRumba}
            paymentReceived={formState.paymentReceived}
            setPaymentReceived={formState.setPaymentReceived}
            daysUntilPaid={formState.daysUntilPaid}
            setDaysUntilPaid={formState.setDaysUntilPaid}
            notes={formState.notes}
            setNotes={formState.setNotes}
            handleSubmitEventData={handleSubmitEventData}
            setShowAddEntryForm={setShowAddEntryForm}
            addPromoter={formState.addPromoter}
            removePromoter={formState.removePromoter}
            updatePromoter={formState.updatePromoter}
            addStaff={formState.addStaff}
            removeStaff={formState.removeStaff}
            updateStaff={formState.updateStaff}
            addVipGirl={formState.addVipGirl}
            removeVipGirl={formState.removeVipGirl}
            updateVipGirl={formState.updateVipGirl}
            addAdSpend={formState.addAdSpend}
            removeAdSpend={formState.removeAdSpend}
            updateAdSpend={formState.updateAdSpend}
          />
        )}
        
        <EventDataList 
          event={event}
          handleDeleteEventData={handleDeleteEventData}
          showAddEntryForm={showAddEntryForm}
          setShowAddEntryForm={setShowAddEntryForm}
          formatDate={formatDate}
        />
      </div>
    </Container>
  );
};

export default EventDetail;

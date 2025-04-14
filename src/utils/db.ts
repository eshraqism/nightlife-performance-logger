
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types';
import { supabase } from '../integrations/supabase/client';

// Create a new event
export async function saveEventToDB(event: Event, userId: string): Promise<Event> {
  // If the event doesn't have an ID, create one
  const eventWithId = !event.id ? { ...event, id: uuidv4() } : event;
  
  // Set timestamps
  const now = new Date().toISOString();
  const eventWithTimestamps = {
    ...eventWithId,
    createdAt: eventWithId.createdAt || now,
    updatedAt: now
  };

  const { data, error } = await supabase
    .from('events')
    .upsert({
      id: eventWithTimestamps.id,
      name: eventWithTimestamps.name,
      frequency: eventWithTimestamps.frequency,
      day_of_week: eventWithTimestamps.dayOfWeek,
      date: eventWithTimestamps.date,
      venue_name: eventWithTimestamps.venueName,
      location: eventWithTimestamps.location,
      time: eventWithTimestamps.time,
      deal_type: eventWithTimestamps.dealType,
      commission_brackets: eventWithTimestamps.commissionBrackets,
      is_paid_from_each_bracket: eventWithTimestamps.isPaidFromEachBracket,
      rumba_percentage: eventWithTimestamps.rumbaPercentage,
      entrance_percentage: eventWithTimestamps.entrancePercentage,
      payment_terms: eventWithTimestamps.paymentTerms,
      partners: eventWithTimestamps.partners,
      event_data: eventWithTimestamps.eventData,
      created_at: eventWithTimestamps.createdAt,
      updated_at: eventWithTimestamps.updatedAt,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving event to Supabase:', error);
    throw error;
  }

  // Convert from snake_case DB format to camelCase for frontend
  return {
    id: data.id,
    name: data.name,
    frequency: data.frequency,
    dayOfWeek: data.day_of_week,
    date: data.date,
    venueName: data.venue_name,
    location: data.location,
    time: data.time,
    dealType: data.deal_type,
    commissionBrackets: data.commission_brackets,
    isPaidFromEachBracket: data.is_paid_from_each_bracket,
    rumbaPercentage: data.rumba_percentage,
    entrancePercentage: data.entrance_percentage,
    paymentTerms: data.payment_terms,
    partners: data.partners,
    eventData: data.event_data,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// Get all events for a user
export async function getAllEvents(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching events from Supabase:', error);
    throw error;
  }

  // Convert from snake_case DB format to camelCase for frontend
  return data.map(event => ({
    id: event.id,
    name: event.name,
    frequency: event.frequency,
    dayOfWeek: event.day_of_week,
    date: event.date,
    venueName: event.venue_name,
    location: event.location,
    time: event.time,
    dealType: event.deal_type,
    commissionBrackets: event.commission_brackets,
    isPaidFromEachBracket: event.is_paid_from_each_bracket,
    rumbaPercentage: event.rumba_percentage,
    entrancePercentage: event.entrance_percentage,
    paymentTerms: event.payment_terms,
    partners: event.partners,
    eventData: event.event_data,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  }));
}

// Get a single event
export async function getSingleEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Code for "No rows found"
      return null;
    }
    console.error('Error fetching event from Supabase:', error);
    throw error;
  }

  // Convert from snake_case DB format to camelCase for frontend
  return {
    id: data.id,
    name: data.name,
    frequency: data.frequency,
    dayOfWeek: data.day_of_week,
    date: data.date,
    venueName: data.venue_name,
    location: data.location,
    time: data.time,
    dealType: data.deal_type,
    commissionBrackets: data.commission_brackets,
    isPaidFromEachBracket: data.is_paid_from_each_bracket,
    rumbaPercentage: data.rumba_percentage,
    entrancePercentage: data.entrance_percentage,
    paymentTerms: data.payment_terms,
    partners: data.partners,
    eventData: data.event_data,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// Delete an event
export async function deleteEventFromDB(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event from Supabase:', error);
    throw error;
  }
}

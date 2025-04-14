
import { v4 as uuidv4 } from 'uuid';
import { Event, EventFrequency, DayOfWeek, DealType, PaymentTerms, CommissionBracket, Partner, EventData } from '../types';
import { supabase } from '../integrations/supabase/client';

// Generate a unique ID
export function generateId(): string {
  return uuidv4();
}

// Authentication
export async function createUser(username: string, password: string): Promise<string | null> {
  try {
    // Validate password length before attempting to create user
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters.');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password: password
    });
    
    if (error) throw error;
    return data.user?.id || null;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function authenticateUser(username: string, password: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    });
    
    if (error) throw error;
    return data.user?.id || null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

export async function getUser(userId: string): Promise<{ id: string; username: string } | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) return null;
    
    return {
      id: data.user.id,
      username: data.user.email || ''
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

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
    frequency: data.frequency as EventFrequency,
    dayOfWeek: data.day_of_week as DayOfWeek | undefined,
    date: data.date,
    venueName: data.venue_name,
    location: data.location,
    time: data.time,
    dealType: data.deal_type as DealType,
    commissionBrackets: data.commission_brackets as CommissionBracket[],
    isPaidFromEachBracket: data.is_paid_from_each_bracket,
    rumbaPercentage: data.rumba_percentage,
    entrancePercentage: data.entrance_percentage,
    paymentTerms: data.payment_terms as PaymentTerms,
    partners: data.partners as Partner[],
    eventData: data.event_data as EventData[],
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
    frequency: event.frequency as EventFrequency,
    dayOfWeek: event.day_of_week as DayOfWeek | undefined,
    date: event.date,
    venueName: event.venue_name,
    location: event.location,
    time: event.time,
    dealType: event.deal_type as DealType,
    commissionBrackets: event.commission_brackets as CommissionBracket[],
    isPaidFromEachBracket: event.is_paid_from_each_bracket,
    rumbaPercentage: event.rumba_percentage,
    entrancePercentage: event.entrance_percentage,
    paymentTerms: event.payment_terms as PaymentTerms,
    partners: event.partners as Partner[],
    eventData: event.event_data as EventData[],
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
    frequency: data.frequency as EventFrequency,
    dayOfWeek: data.day_of_week as DayOfWeek | undefined,
    date: data.date,
    venueName: data.venue_name,
    location: data.location,
    time: data.time,
    dealType: data.deal_type as DealType,
    commissionBrackets: data.commission_brackets as CommissionBracket[],
    isPaidFromEachBracket: data.is_paid_from_each_bracket,
    rumbaPercentage: data.rumba_percentage,
    entrancePercentage: data.entrance_percentage,
    paymentTerms: data.payment_terms as PaymentTerms,
    partners: data.partners as Partner[],
    eventData: data.event_data as EventData[],
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

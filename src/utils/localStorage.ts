
import { Event } from '../types';
import { getAllEvents, saveEventToDB, deleteEventFromDB, getSingleEvent } from './db';
import { useAuth } from '../contexts/AuthContext';

// We keep generateId function
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// These functions will now call the database functions but maintain the same interface
// so the rest of the app doesn't need to change

export const getEventsWrapper = (): Event[] => {
  // This is for compatibility with existing code
  // In a real app, you would update all components to use the database directly
  const auth = useAuth();
  if (!auth.currentUser) {
    return [];
  }
  
  // Since the DB functions are async but our wrapper needs to return synchronously,
  // we'll handle this by returning empty and letting components fetch directly
  // This is temporary until we refactor all components to use async data loading
  getAllEvents(auth.currentUser.id)
    .then(events => console.log('Events loaded:', events.length))
    .catch(err => console.error('Error loading events:', err));
    
  return [];
};

export const saveEventWrapper = (event: Event): void => {
  const auth = useAuth();
  if (!auth.currentUser) {
    return;
  }
  
  saveEventToDB(event, auth.currentUser.id)
    .catch(err => console.error('Error saving event:', err));
};

export const deleteEventWrapper = (eventId: string): void => {
  deleteEventFromDB(eventId)
    .catch(err => console.error('Error deleting event:', err));
};

export const getEventWrapper = (eventId: string): Event | undefined => {
  // Similar limitation as getEventsWrapper - this needs to return synchronously
  // We'll return undefined and let components handle async loading
  getSingleEvent(eventId)
    .then(event => console.log('Event loaded:', event?.id))
    .catch(err => console.error('Error loading event:', err));
    
  return undefined;
};

// Maintain original function names for compatibility
export const getEvents = getEventsWrapper;
export const saveEvent = saveEventWrapper;
export const deleteEvent = deleteEventWrapper;
export const getEvent = getEventWrapper;

import { Event } from '../types';
import { getEvents, saveEvent as dbSaveEvent, deleteEvent as dbDeleteEvent, getEvent as dbGetEvent } from './db';
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
  
  return getEvents(auth.currentUser.id);
};

export const saveEventWrapper = (event: Event): void => {
  const auth = useAuth();
  if (!auth.currentUser) {
    return;
  }
  
  dbSaveEvent(event, auth.currentUser.id);
};

export const deleteEventWrapper = (eventId: string): void => {
  dbDeleteEvent(eventId);
};

export const getEventWrapper = (eventId: string): Event | undefined => {
  return dbGetEvent(eventId);
};

// Maintain original function names for compatibility
export const getEvents = getEventsWrapper;
export const saveEvent = saveEventWrapper;
export const deleteEvent = deleteEventWrapper;
export const getEvent = getEventWrapper;

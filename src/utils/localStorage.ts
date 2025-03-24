
import { Event } from '../types';

const EVENTS_STORAGE_KEY = 'nightlife-events';

export const getEvents = (): Event[] => {
  const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
  return eventsJson ? JSON.parse(eventsJson) : [];
};

export const saveEvent = (event: Event): void => {
  const events = getEvents();
  const existingEventIndex = events.findIndex(e => e.id === event.id);
  
  if (existingEventIndex !== -1) {
    // Update existing event
    events[existingEventIndex] = { ...event, updatedAt: new Date().toISOString() };
  } else {
    // Add new event
    events.push(event);
  }
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
};

export const getEvent = (eventId: string): Event | undefined => {
  const events = getEvents();
  return events.find(e => e.id === eventId);
};

// Helper to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

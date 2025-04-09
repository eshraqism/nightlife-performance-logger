
// Import IndexedDB helper library
import { openDB, deleteDB } from 'idb';
import { Event } from '../types';
import { generateId } from './localStorage';

// Define database schema
const DB_NAME = 'nightlifeDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const EVENTS_STORE = 'events';

// Initialize the database
const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // Create users store if it doesn't exist
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: true });
      }
      
      // Create events store if it doesn't exist
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const eventStore = db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
        eventStore.createIndex('userId', 'userId', { unique: false });
      }
    }
  });
  return db;
};

// User functions
export const createUser = async (username: string, password: string): Promise<string> => {
  const id = generateId();
  const now = new Date().toISOString();
  
  try {
    const db = await initDB();
    await db.put(USERS_STORE, {
      id,
      username,
      password, // Note: In a real app, this should be hashed
      created_at: now
    });
    return id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const authenticateUser = async (username: string, password: string): Promise<string | null> => {
  try {
    const db = await initDB();
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('username');
    
    const user = await index.get(username);
    
    if (user && user.password === password) {
      return user.id;
    }
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

export const getUser = async (userId: string) => {
  try {
    const db = await initDB();
    const user = await db.get(USERS_STORE, userId);
    return user ? {
      id: user.id,
      username: user.username,
      created_at: user.created_at
    } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Event functions
export const getAllEvents = async (userId: string): Promise<Event[]> => {
  try {
    const db = await initDB();
    const tx = db.transaction(EVENTS_STORE, 'readonly');
    const store = tx.objectStore(EVENTS_STORE);
    const index = store.index('userId');
    
    const events = await index.getAll(userId);
    
    return events.map(event => ({
      ...event,
      partners: typeof event.partners === 'string' ? JSON.parse(event.partners) : event.partners,
      eventData: typeof event.eventData === 'string' ? JSON.parse(event.eventData) : event.eventData
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const getSingleEvent = async (eventId: string): Promise<Event | undefined> => {
  try {
    const db = await initDB();
    const event = await db.get(EVENTS_STORE, eventId);
    
    if (!event) return undefined;
    
    return {
      ...event,
      partners: typeof event.partners === 'string' ? JSON.parse(event.partners) : event.partners,
      eventData: typeof event.eventData === 'string' ? JSON.parse(event.eventData) : event.eventData
    };
  } catch (error) {
    console.error('Error getting event:', error);
    return undefined;
  }
};

export const saveEventToDB = async (event: Event, userId: string): Promise<void> => {
  const now = new Date().toISOString();
  
  try {
    const db = await initDB();
    const existingEvent = await db.get(EVENTS_STORE, event.id);
    
    // Prepare event data ensuring partners and eventData are stored as strings
    const eventToSave = {
      ...event,
      partners: typeof event.partners === 'string' ? event.partners : JSON.stringify(event.partners),
      eventData: typeof event.eventData === 'string' ? event.eventData : JSON.stringify(event.eventData),
      userId
    };
    
    if (existingEvent) {
      // Update existing event
      await db.put(EVENTS_STORE, {
        ...eventToSave,
        updatedAt: now
      });
    } else {
      // Create new event
      await db.put(EVENTS_STORE, {
        ...eventToSave,
        createdAt: now,
        updatedAt: now
      });
    }
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const deleteEventFromDB = async (eventId: string): Promise<void> => {
  try {
    const db = await initDB();
    await db.delete(EVENTS_STORE, eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

// Migrate existing localStorage data to IndexedDB
export const migrateLocalStorageToIndexedDB = async (userId: string): Promise<void> => {
  try {
    const EVENTS_STORAGE_KEY = 'nightlife-events';
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (eventsJson) {
      const events = JSON.parse(eventsJson) as Event[];
      
      // Process events in sequence
      for (const event of events) {
        await saveEventToDB(event, userId);
      }
      
      // Clear localStorage after migration
      localStorage.removeItem(EVENTS_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};

// Export with clear names to avoid conflicts
export { getAllEvents as getEvents };
export { getSingleEvent as getEvent };
export { saveEventToDB as saveEvent };
export { deleteEventFromDB as deleteEvent };

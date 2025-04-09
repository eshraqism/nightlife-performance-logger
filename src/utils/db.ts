
import Database from 'better-sqlite3';
import { Event } from '../types';
import { generateId } from './localStorage';

// Initialize the database
const db = new Database('nightlife.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dayOfWeek TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    venueName TEXT NOT NULL,
    location TEXT NOT NULL,
    dealType TEXT NOT NULL,
    rumbaPercentage REAL NOT NULL,
    paymentTerms TEXT NOT NULL,
    partners TEXT NOT NULL,
    eventData TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// User functions
export const createUser = (username: string, password: string): string => {
  const id = generateId();
  
  try {
    const stmt = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');
    stmt.run(id, username, password);
    return id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const authenticateUser = (username: string, password: string): string | null => {
  try {
    const stmt = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?');
    const user = stmt.get(username, password) as { id: string } | undefined;
    return user ? user.id : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

export const getUser = (userId: string) => {
  try {
    const stmt = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?');
    return stmt.get(userId);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Event functions
export const getEvents = (userId: string): Event[] => {
  try {
    const stmt = db.prepare('SELECT * FROM events WHERE userId = ?');
    const events = stmt.all(userId) as any[];
    return events.map(event => ({
      ...event,
      partners: JSON.parse(event.partners),
      eventData: JSON.parse(event.eventData)
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const getEvent = (eventId: string): Event | undefined => {
  try {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(eventId) as any;
    if (!event) return undefined;
    
    return {
      ...event,
      partners: JSON.parse(event.partners),
      eventData: JSON.parse(event.eventData)
    };
  } catch (error) {
    console.error('Error getting event:', error);
    return undefined;
  }
};

export const saveEvent = (event: Event, userId: string): void => {
  const now = new Date().toISOString();
  
  try {
    const checkStmt = db.prepare('SELECT id FROM events WHERE id = ?');
    const exists = checkStmt.get(event.id);
    
    if (exists) {
      // Update
      const stmt = db.prepare(`
        UPDATE events 
        SET name = ?, dayOfWeek = ?, date = ?, time = ?, venueName = ?, 
            location = ?, dealType = ?, rumbaPercentage = ?, paymentTerms = ?, 
            partners = ?, eventData = ?, updatedAt = ? 
        WHERE id = ?
      `);
      
      stmt.run(
        event.name,
        event.dayOfWeek,
        event.date,
        event.time,
        event.venueName,
        event.location,
        event.dealType,
        event.rumbaPercentage,
        event.paymentTerms,
        JSON.stringify(event.partners),
        JSON.stringify(event.eventData),
        now,
        event.id
      );
    } else {
      // Insert
      const stmt = db.prepare(`
        INSERT INTO events (
          id, name, dayOfWeek, date, time, venueName, location, dealType, 
          rumbaPercentage, paymentTerms, partners, eventData, createdAt, updatedAt, userId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        event.id,
        event.name,
        event.dayOfWeek,
        event.date,
        event.time,
        event.venueName,
        event.location,
        event.dealType,
        event.rumbaPercentage,
        event.paymentTerms,
        JSON.stringify(event.partners),
        JSON.stringify(event.eventData),
        now,
        now,
        userId
      );
    }
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const deleteEvent = (eventId: string): void => {
  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

// Migrate existing localStorage data to SQLite
export const migrateLocalStorageToSQLite = (userId: string): void => {
  try {
    const EVENTS_STORAGE_KEY = 'nightlife-events';
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (eventsJson) {
      const events = JSON.parse(eventsJson) as Event[];
      events.forEach(event => saveEvent(event, userId));
      
      // Clear localStorage after migration
      localStorage.removeItem(EVENTS_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};

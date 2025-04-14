
import React from 'react';
import { ArrowLeft, CalendarPlus, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../types';

interface EventDetailHeaderProps {
  event: Event;
  showAddEntryForm: boolean;
  setShowAddEntryForm: (show: boolean) => void;
  handleDeleteEvent: () => void;
  formatDate: (dateString: string) => string;
}

const EventDetailHeader = ({ 
  event, 
  showAddEntryForm, 
  setShowAddEntryForm, 
  handleDeleteEvent,
  formatDate
}: EventDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default EventDetailHeader;

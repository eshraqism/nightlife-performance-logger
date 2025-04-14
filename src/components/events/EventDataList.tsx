
import React from 'react';
import { Info, CalendarPlus } from 'lucide-react';
import { Event, EventData } from '../../types';
import EventDataCard from './EventDataCard';

interface EventDataListProps {
  event: Event;
  handleDeleteEventData: (index: number) => void;
  showAddEntryForm: boolean;
  setShowAddEntryForm: (show: boolean) => void;
  formatDate: (dateString: string) => string;
}

const EventDataList = ({ 
  event, 
  handleDeleteEventData,
  showAddEntryForm,
  setShowAddEntryForm,
  formatDate
}: EventDataListProps) => {
  if (!event) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Event Data</h2>
      
      {event.eventData.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-4">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No data entries yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start tracking your event performance by adding data for each event date.
          </p>
          {!showAddEntryForm && (
            <button
              onClick={() => setShowAddEntryForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Event Data
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {event.eventData.map((data, index) => (
            <EventDataCard 
              key={index} 
              data={data} 
              index={index} 
              handleDeleteEventData={handleDeleteEventData}
              event={event}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDataList;


import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Percent } from 'lucide-react';
import { Event } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Format the date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate total revenue across all event data entries
  const totalRevenue = event.eventData.reduce((sum, data) => sum + data.totalRevenue, 0);
  
  // Count number of event dates
  const eventDatesCount = event.eventData.length;

  return (
    <Link to={`/event/${event.id}`}>
      <div className="glass-card rounded-xl p-6 h-full flex flex-col animate-fadeIn">
        <div className="mb-4 flex justify-between items-start">
          <h3 className="text-xl font-semibold line-clamp-1">{event.name}</h3>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            {event.dealType}
          </span>
        </div>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{event.dayOfWeek}, {formattedDate}</span>
          </div>
          
          {event.time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{event.time}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.venueName}{event.location ? `, ${event.location}` : ''}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Percent className="mr-2 h-4 w-4" />
            <span>Rumba: {event.rumbaPercentage}%</span>
          </div>
        </div>
        
        <div className="pt-4 border-t flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="font-medium">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Event Dates</p>
            <p className="font-medium">{eventDatesCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

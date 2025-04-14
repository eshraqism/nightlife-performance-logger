
import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Percent, 
  CreditCard,
  Users 
} from 'lucide-react';
import { Event } from '../../types';

interface EventDetailsCardProps {
  event: Event;
  formatDate: (dateString: string) => string;
}

const EventDetailsCard = ({ event, formatDate }: EventDetailsCardProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span className="ml-2">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Time:</span>
            <span className="ml-2">{event.time}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Venue:</span>
            <span className="ml-2">{event.venueName}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Location:</span>
            <span className="ml-2">{event.location}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Deal Type:</span>
            <span className="ml-2">{event.dealType}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Rumba %:</span>
            <span className="ml-2">{event.rumbaPercentage}%</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Payment Terms:</span>
            <span className="ml-2">{event.paymentTerms}</span>
          </div>
        </div>
        
        <div className="space-y-1 md:col-span-2">
          <div className="flex items-start text-sm">
            <Users className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <span className="font-medium">Partners:</span>
              {event.partners.length === 0 ? (
                <span className="ml-2">None</span>
              ) : (
                <ul className="mt-1 space-y-1">
                  {event.partners.map((partner, idx) => (
                    <li key={idx} className="flex items-center">
                      <span>{partner.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        ({partner.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsCard;

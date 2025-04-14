
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Event, EventData } from '../../types';
import { 
  formatCurrency, 
  calculateTotalCommissions, 
  calculateTotalExpenses, 
  calculateProfit 
} from '../../utils/calculations';

interface EventDataCardProps {
  data: EventData;
  index: number;
  handleDeleteEventData: (index: number) => void;
  event: Event;
  formatDate: (dateString: string) => string;
}

const EventDataCard = ({ data, index, handleDeleteEventData, event, formatDate }: EventDataCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="glass-card rounded-xl divide-y animate-fadeIn">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {formatDate(data.date)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {data.totalAttendees} attendees, {data.tablesFromRumba} tables
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-full p-2 hover:bg-muted"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleDeleteEventData(index)}
              className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="font-medium">{formatCurrency(data.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className="font-medium">
              {event && formatCurrency(calculateProfit(event, data))}
            </p>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 sm:p-6 space-y-4">
          {data.promoters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Promoters</h4>
              <ul className="space-y-1 text-sm">
                {data.promoters.map((promoter, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{promoter.name}</span>
                    <span>{formatCurrency(promoter.commission)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.staff.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Staff</h4>
              <ul className="space-y-1 text-sm">
                {data.staff.map((staffMember, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {staffMember.name} ({staffMember.role})
                    </span>
                    <span>{formatCurrency(staffMember.payment)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.vipGirlsCommissions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">VIP Girls</h4>
              <ul className="space-y-1 text-sm">
                {data.vipGirlsCommissions.map((girl, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{girl.name}</span>
                    <span>{formatCurrency(girl.commission)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.adSpend.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Ad Spend</h4>
              <ul className="space-y-1 text-sm">
                {data.adSpend.map((ad, idx) => (
                  <li key={idx} className="flex flex-col">
                    <div className="flex justify-between">
                      <span>{ad.platform}</span>
                      <span>{formatCurrency(ad.amount)}</span>
                    </div>
                    {(ad.reach || ad.clicks || ad.leads) && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {ad.reach && <span>Reach: {ad.reach} • </span>}
                        {ad.clicks && <span>Clicks: {ad.clicks} • </span>}
                        {ad.leads && <span>Leads: {ad.leads}</span>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Total Commissions</p>
              <p className="font-medium">
                {formatCurrency(calculateTotalCommissions(data))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <p className="font-medium">
                {formatCurrency(calculateTotalExpenses(data))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Status</p>
              <p className="font-medium">
                {data.paymentReceived ? 'Received' : 'Pending'}
              </p>
            </div>
            {data.paymentReceived && data.daysUntilPaid !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">Days Until Paid</p>
                <p className="font-medium">{data.daysUntilPaid} days</p>
              </div>
            )}
          </div>
          
          {data.notes && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <p className="text-sm">{data.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDataCard;

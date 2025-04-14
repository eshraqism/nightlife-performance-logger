
import React from 'react';
import { formatCurrency } from '../../utils/calculations';

interface EventSummaryProps {
  summary: {
    totalRevenue: number;
    totalProfit: number;
    totalAttendees: number;
    totalTables: number;
    totalCommissions: number;
    totalExpenses: number;
  } | null;
}

const EventSummaryCard = ({ summary }: EventSummaryProps) => {
  if (!summary) return null;
  
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-semibold">{formatCurrency(summary.totalRevenue)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Profit</p>
          <p className="text-2xl font-semibold">{formatCurrency(summary.totalProfit)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Attendees</p>
          <p className="text-2xl font-semibold">{summary.totalAttendees}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Tables</p>
          <p className="text-2xl font-semibold">{summary.totalTables}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Commissions</p>
          <p className="text-2xl font-semibold">{formatCurrency(summary.totalCommissions)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-semibold">{formatCurrency(summary.totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default EventSummaryCard;

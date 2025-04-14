
import { useMemo } from 'react';
import { Event, EventData } from '../types';
import { 
  calculateTotalCommissions, 
  calculateTotalExpenses, 
  calculateRumbaRevenue, 
  calculateProfit
} from '../utils/calculations';

export const useEventSummary = (event: Event | null) => {
  const summary = useMemo(() => {
    if (!event || event.eventData.length === 0) return null;
    
    const totalRevenue = event.eventData.reduce((sum, data) => sum + data.totalRevenue, 0);
    const totalAttendees = event.eventData.reduce((sum, data) => sum + data.totalAttendees, 0);
    const totalTables = event.eventData.reduce((sum, data) => sum + data.tablesFromRumba, 0);
    
    const totalCommissions = event.eventData.reduce((sum, data) => sum + calculateTotalCommissions(data), 0);
    const totalExpenses = event.eventData.reduce((sum, data) => sum + calculateTotalExpenses(data), 0);
    
    const totalProfit = event.eventData.reduce((sum, data) => sum + calculateProfit(event, data), 0);
    
    return {
      totalRevenue,
      totalAttendees,
      totalTables,
      totalCommissions,
      totalExpenses,
      totalProfit
    };
  }, [event]);

  return summary;
};

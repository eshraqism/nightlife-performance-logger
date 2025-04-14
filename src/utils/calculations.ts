
import { Event, EventData } from '../types';

export const calculateTotalCommissions = (eventData: EventData): number => {
  // Sum promoter commissions
  const promoterCommissions = eventData.promoters.reduce((sum, promoter) => sum + promoter.commission, 0);
  
  // Sum staff payments
  const staffPayments = eventData.staff.reduce((sum, staff) => sum + staff.payment, 0);
  
  // Sum VIP girls commissions
  const vipGirlsCommissions = eventData.vipGirlsCommissions.reduce((sum, girl) => sum + girl.commission, 0);
  
  // Add table commissions
  return promoterCommissions + staffPayments + vipGirlsCommissions + eventData.tableCommissions;
};

export const calculateTotalExpenses = (eventData: EventData): number => {
  // Sum ad spend
  const adSpend = eventData.adSpend.reduce((sum, ad) => sum + ad.amount, 0);
  
  // Total commissions + ad spend
  return calculateTotalCommissions(eventData) + adSpend;
};

export const calculateRumbaRevenue = (event: Event, eventData: EventData): number => {
  let revenue = 0;
  
  if (event.dealType === 'Revenue Share') {
    // Revenue is a percentage of the total revenue
    revenue = (eventData.totalRevenue * event.rumbaPercentage) / 100;
  } else if (event.dealType === 'Entrance Deal') {
    // Revenue is a percentage of the door revenue
    revenue = eventData.doorRevenue ? (eventData.doorRevenue * event.rumbaPercentage) / 100 : 0;
  } else if (event.dealType === 'Revenue Share & Entrance Deal') {
    // Revenue is a percentage of both total revenue and entrance revenue
    const totalRevenuePart = (eventData.totalRevenue * event.rumbaPercentage) / 100;
    const entranceRevenuePart = eventData.entranceRevenue && event.entrancePercentage ? 
      (eventData.entranceRevenue * event.entrancePercentage) / 100 : 0;
    revenue = totalRevenuePart + entranceRevenuePart;
  }
  
  return revenue;
};

export const calculateProfit = (event: Event, eventData: EventData): number => {
  const rumbaRevenue = calculateRumbaRevenue(event, eventData);
  const totalExpenses = calculateTotalExpenses(eventData);
  
  return rumbaRevenue - totalExpenses;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

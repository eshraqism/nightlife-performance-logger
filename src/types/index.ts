
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type DealType = 'Revenue Share' | 'Entrance Deal';

export type PaymentTerms = '50% upfront' | 'Weekly' | 'Bi-weekly' | 'Monthly' | 'End of month' | 'Other';

export type Partner = {
  name: string;
  percentage: number;
};

export type Promoter = {
  name: string;
  commission: number;
};

export type Staff = {
  role: string;
  name: string;
  payment: number;
};

export type VipGirl = {
  name: string;
  commission: number;
};

export type AdSpend = {
  platform: string;
  amount: number;
  reach?: number;
  clicks?: number;
  leads?: number;
};

export type EventData = {
  promoters: Promoter[];
  staff: Staff[];
  tableCommissions: number;
  vipGirlsCommissions: VipGirl[];
  adSpend: AdSpend[];
  leadsCollected: number;
  doorRevenue?: number; // Only for 'Entrance Deal'
  totalRevenue: number;
  totalAttendees: number;
  tablesFromRumba: number;
  paymentReceived: boolean;
  daysUntilPaid?: number;
  date: string; // ISO string date of this specific event
  notes?: string;
};

export type Event = {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  date: string; // ISO string date of the event start
  time: string;
  venueName: string;
  location: string;
  dealType: DealType;
  rumbaPercentage: number;
  paymentTerms: PaymentTerms;
  partners: Partner[];
  eventData: EventData[];
  createdAt: string;
  updatedAt: string;
};

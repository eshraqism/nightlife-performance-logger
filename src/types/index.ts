
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type DealType = 'Revenue Share' | 'Revenue Share & Entrance Deal' | 'Entrance Deal';

export type PaymentTerms = 'One week' | 'Two weeks' | 'Three weeks' | 'One month';

export type EventFrequency = 'Weekly' | 'Monthly' | 'One Time';

export type CommissionBracket = {
  percentage: number;
  fromAmount: number;
  toAmount: number | null;  // null represents unlimited
};

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
  entranceRevenue?: number; // Only for 'Revenue Share & Entrance Deal'
  entrancePercentage?: number; // Only for 'Revenue Share & Entrance Deal'
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
  frequency: EventFrequency;
  dayOfWeek?: DayOfWeek; // Required for weekly events
  date: string; // ISO string date of the event start
  venueName: string;
  location?: string; 
  time?: string; 
  dealType: DealType;
  commissionBrackets: CommissionBracket[];
  isPaidFromEachBracket: boolean;
  rumbaPercentage: number;
  entrancePercentage?: number; // Only for 'Revenue Share & Entrance Deal'
  paymentTerms: PaymentTerms;
  partners: Partner[];
  eventData: EventData[];
  createdAt?: string;
  updatedAt?: string;
};

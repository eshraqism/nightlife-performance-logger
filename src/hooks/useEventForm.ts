
import { useState } from 'react';
import { 
  Promoter, 
  Staff, 
  VipGirl, 
  AdSpend 
} from '../types';

export const useEventForm = () => {
  const [formDate, setFormDate] = useState('');
  const [promoters, setPromoters] = useState<Promoter[]>([{ name: '', commission: 0 }]);
  const [staff, setStaff] = useState<Staff[]>([{ role: '', name: '', payment: 0 }]);
  const [tableCommissions, setTableCommissions] = useState(0);
  const [vipGirls, setVipGirls] = useState<VipGirl[]>([{ name: '', commission: 0 }]);
  const [adSpend, setAdSpend] = useState<AdSpend[]>([{ platform: '', amount: 0 }]);
  const [leadsCollected, setLeadsCollected] = useState(0);
  const [doorRevenue, setDoorRevenue] = useState<number | undefined>(undefined);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [tablesFromRumba, setTablesFromRumba] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [daysUntilPaid, setDaysUntilPaid] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  
  const addPromoter = () => {
    setPromoters([...promoters, { name: '', commission: 0 }]);
  };
  
  const removePromoter = (index: number) => {
    setPromoters(promoters.filter((_, i) => i !== index));
  };
  
  const updatePromoter = (index: number, field: keyof Promoter, value: string | number) => {
    const updatedPromoters = [...promoters];
    updatedPromoters[index] = { 
      ...updatedPromoters[index], 
      [field]: field === 'commission' ? Number(value) : value 
    };
    setPromoters(updatedPromoters);
  };
  
  const addStaff = () => {
    setStaff([...staff, { role: '', name: '', payment: 0 }]);
  };
  
  const removeStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };
  
  const updateStaff = (index: number, field: keyof Staff, value: string | number) => {
    const updatedStaff = [...staff];
    updatedStaff[index] = { 
      ...updatedStaff[index], 
      [field]: field === 'payment' ? Number(value) : value 
    };
    setStaff(updatedStaff);
  };
  
  const addVipGirl = () => {
    setVipGirls([...vipGirls, { name: '', commission: 0 }]);
  };
  
  const removeVipGirl = (index: number) => {
    setVipGirls(vipGirls.filter((_, i) => i !== index));
  };
  
  const updateVipGirl = (index: number, field: keyof VipGirl, value: string | number) => {
    const updatedVipGirls = [...vipGirls];
    updatedVipGirls[index] = { 
      ...updatedVipGirls[index], 
      [field]: field === 'commission' ? Number(value) : value 
    };
    setVipGirls(updatedVipGirls);
  };
  
  const addAdSpend = () => {
    setAdSpend([...adSpend, { platform: '', amount: 0 }]);
  };
  
  const removeAdSpend = (index: number) => {
    setAdSpend(adSpend.filter((_, i) => i !== index));
  };
  
  const updateAdSpend = (index: number, field: keyof AdSpend, value: string | number) => {
    const updatedAdSpend = [...adSpend];
    updatedAdSpend[index] = { 
      ...updatedAdSpend[index], 
      [field]: ['amount', 'reach', 'clicks', 'leads'].includes(field) ? Number(value) : value 
    };
    setAdSpend(updatedAdSpend);
  };
  
  const resetForm = () => {
    setFormDate('');
    setPromoters([{ name: '', commission: 0 }]);
    setStaff([{ role: '', name: '', payment: 0 }]);
    setTableCommissions(0);
    setVipGirls([{ name: '', commission: 0 }]);
    setAdSpend([{ platform: '', amount: 0 }]);
    setLeadsCollected(0);
    setDoorRevenue(undefined);
    setTotalRevenue(0);
    setTotalAttendees(0);
    setTablesFromRumba(0);
    setPaymentReceived(false);
    setDaysUntilPaid(undefined);
    setNotes('');
  };
  
  return {
    formDate,
    setFormDate,
    promoters,
    setPromoters,
    staff,
    setStaff,
    tableCommissions,
    setTableCommissions,
    vipGirls,
    setVipGirls,
    adSpend,
    setAdSpend,
    leadsCollected,
    setLeadsCollected,
    doorRevenue,
    setDoorRevenue,
    totalRevenue,
    setTotalRevenue,
    totalAttendees,
    setTotalAttendees,
    tablesFromRumba,
    setTablesFromRumba,
    paymentReceived,
    setPaymentReceived,
    daysUntilPaid,
    setDaysUntilPaid,
    notes,
    setNotes,
    addPromoter,
    removePromoter,
    updatePromoter,
    addStaff,
    removeStaff,
    updateStaff,
    addVipGirl,
    removeVipGirl,
    updateVipGirl,
    addAdSpend,
    removeAdSpend,
    updateAdSpend,
    resetForm
  };
};

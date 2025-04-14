
import React from 'react';
import { Loader2, Plus, X, DollarSign, UserPlus, Trash2 } from 'lucide-react';
import { 
  Promoter, 
  Staff, 
  VipGirl, 
  AdSpend, 
  Event 
} from '../../types';

interface EventDataFormProps {
  event: Event;
  saving: boolean;
  formDate: string;
  setFormDate: (value: string) => void;
  promoters: Promoter[];
  setPromoters: (promoters: Promoter[]) => void;
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
  tableCommissions: number;
  setTableCommissions: (value: number) => void;
  vipGirls: VipGirl[];
  setVipGirls: (vipGirls: VipGirl[]) => void;
  adSpend: AdSpend[];
  setAdSpend: (adSpend: AdSpend[]) => void;
  leadsCollected: number;
  setLeadsCollected: (value: number) => void;
  doorRevenue: number | undefined;
  setDoorRevenue: (value: number | undefined) => void;
  totalRevenue: number;
  setTotalRevenue: (value: number) => void;
  totalAttendees: number;
  setTotalAttendees: (value: number) => void;
  tablesFromRumba: number;
  setTablesFromRumba: (value: number) => void;
  paymentReceived: boolean;
  setPaymentReceived: (value: boolean) => void;
  daysUntilPaid: number | undefined;
  setDaysUntilPaid: (value: number | undefined) => void;
  notes: string;
  setNotes: (value: string) => void;
  handleSubmitEventData: (e: React.FormEvent) => void;
  setShowAddEntryForm: (show: boolean) => void;
  addPromoter: () => void;
  removePromoter: (index: number) => void;
  updatePromoter: (index: number, field: keyof Promoter, value: string | number) => void;
  addStaff: () => void;
  removeStaff: (index: number) => void;
  updateStaff: (index: number, field: keyof Staff, value: string | number) => void;
  addVipGirl: () => void;
  removeVipGirl: (index: number) => void;
  updateVipGirl: (index: number, field: keyof VipGirl, value: string | number) => void;
  addAdSpend: () => void;
  removeAdSpend: (index: number) => void;
  updateAdSpend: (index: number, field: keyof AdSpend, value: string | number) => void;
}

const EventDataForm = ({
  event,
  saving,
  formDate,
  setFormDate,
  promoters,
  staff,
  tableCommissions,
  setTableCommissions,
  vipGirls,
  adSpend,
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
  handleSubmitEventData,
  setShowAddEntryForm,
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
  updateAdSpend
}: EventDataFormProps) => {
  return (
    <form onSubmit={handleSubmitEventData} className="glass-card rounded-xl p-6 space-y-8 animate-slideUp">
      <h2 className="text-xl font-semibold">Add Event Data</h2>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Event Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="formDate" className="text-sm font-medium">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="formDate"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="totalAttendees" className="text-sm font-medium">
              Total Attendees <span className="text-red-500">*</span>
            </label>
            <input
              id="totalAttendees"
              type="number"
              min="0"
              value={totalAttendees}
              onChange={(e) => setTotalAttendees(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tablesFromRumba" className="text-sm font-medium">
              Tables from Rumba <span className="text-red-500">*</span>
            </label>
            <input
              id="tablesFromRumba"
              type="number"
              min="0"
              value={tablesFromRumba}
              onChange={(e) => setTablesFromRumba(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="leadsCollected" className="text-sm font-medium">
              Leads Collected
            </label>
            <input
              id="leadsCollected"
              type="number"
              min="0"
              value={leadsCollected}
              onChange={(e) => setLeadsCollected(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {(event.dealType === 'Entrance Deal' || event.dealType === 'Revenue Share & Entrance Deal') && (
            <div className="space-y-2">
              <label htmlFor="doorRevenue" className="text-sm font-medium">
                Door Revenue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="doorRevenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={doorRevenue ?? ''}
                  onChange={(e) => setDoorRevenue(Number(e.target.value))}
                  className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="totalRevenue" className="text-sm font-medium">
              Total Revenue <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="totalRevenue"
                type="number"
                min="0"
                step="0.01"
                value={totalRevenue}
                onChange={(e) => setTotalRevenue(Number(e.target.value))}
                className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="paymentReceived" className="text-sm font-medium">
                Payment Received
              </label>
              <input
                id="paymentReceived"
                type="checkbox"
                checked={paymentReceived}
                onChange={(e) => setPaymentReceived(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
          
          {paymentReceived && (
            <div className="space-y-2">
              <label htmlFor="daysUntilPaid" className="text-sm font-medium">
                Days Until Paid
              </label>
              <input
                id="daysUntilPaid"
                type="number"
                min="0"
                value={daysUntilPaid ?? ''}
                onChange={(e) => setDaysUntilPaid(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Promoters</h3>
          <button
            type="button"
            onClick={addPromoter}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Promoter
          </button>
        </div>
        
        <div className="space-y-4">
          {promoters.map((promoter, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-grow space-y-2">
                <label 
                  htmlFor={`promoterName-${index}`} 
                  className="text-sm font-medium"
                >
                  Promoter Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id={`promoterName-${index}`}
                    type="text"
                    value={promoter.name}
                    onChange={(e) => updatePromoter(index, 'name', e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Promoter name"
                  />
                </div>
              </div>
              <div className="w-40 space-y-2">
                <label 
                  htmlFor={`promoterCommission-${index}`} 
                  className="text-sm font-medium"
                >
                  Commission
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id={`promoterCommission-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={promoter.commission}
                    onChange={(e) => updatePromoter(index, 'commission', e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePromoter(index)}
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                aria-label="Remove promoter"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Staff</h3>
          <button
            type="button"
            onClick={addStaff}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Staff
          </button>
        </div>
        
        <div className="space-y-4">
          {staff.map((staffMember, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="w-1/3 space-y-2">
                <label 
                  htmlFor={`staffRole-${index}`} 
                  className="text-sm font-medium"
                >
                  Role
                </label>
                <input
                  id={`staffRole-${index}`}
                  type="text"
                  value={staffMember.role}
                  onChange={(e) => updateStaff(index, 'role', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Photographer"
                />
              </div>
              <div className="flex-grow space-y-2">
                <label 
                  htmlFor={`staffName-${index}`} 
                  className="text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id={`staffName-${index}`}
                  type="text"
                  value={staffMember.name}
                  onChange={(e) => updateStaff(index, 'name', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Staff name"
                />
              </div>
              <div className="w-40 space-y-2">
                <label 
                  htmlFor={`staffPayment-${index}`} 
                  className="text-sm font-medium"
                >
                  Payment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id={`staffPayment-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={staffMember.payment}
                    onChange={(e) => updateStaff(index, 'payment', e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeStaff(index)}
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                aria-label="Remove staff"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Table Commissions</h3>
        
        <div className="space-y-2">
          <label htmlFor="tableCommissions" className="text-sm font-medium">
            Total Table Commissions
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="tableCommissions"
              type="number"
              min="0"
              step="0.01"
              value={tableCommissions}
              onChange={(e) => setTableCommissions(Number(e.target.value))}
              className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">VIP Girls Commissions</h3>
          <button
            type="button"
            onClick={addVipGirl}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add VIP Girl
          </button>
        </div>
        
        <div className="space-y-4">
          {vipGirls.map((girl, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-grow space-y-2">
                <label 
                  htmlFor={`vipGirlName-${index}`} 
                  className="text-sm font-medium"
                >
                  Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id={`vipGirlName-${index}`}
                    type="text"
                    value={girl.name}
                    onChange={(e) => updateVipGirl(index, 'name', e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="VIP Girl name"
                  />
                </div>
              </div>
              <div className="w-40 space-y-2">
                <label 
                  htmlFor={`vipGirlCommission-${index}`} 
                  className="text-sm font-medium"
                >
                  Commission
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id={`vipGirlCommission-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={girl.commission}
                    onChange={(e) => updateVipGirl(index, 'commission', e.target.value)}
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVipGirl(index)}
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                aria-label="Remove VIP girl"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Ad Spend</h3>
          <button
            type="button"
            onClick={addAdSpend}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Ad Platform
          </button>
        </div>
        
        <div className="space-y-6">
          {adSpend.map((ad, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-grow space-y-2">
                  <label 
                    htmlFor={`adPlatform-${index}`} 
                    className="text-sm font-medium"
                  >
                    Platform
                  </label>
                  <input
                    id={`adPlatform-${index}`}
                    type="text"
                    value={ad.platform}
                    onChange={(e) => updateAdSpend(index, 'platform', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Instagram, Google"
                  />
                </div>
                <div className="w-40 space-y-2">
                  <label 
                    htmlFor={`adAmount-${index}`} 
                    className="text-sm font-medium"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id={`adAmount-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={ad.amount}
                      onChange={(e) => updateAdSpend(index, 'amount', e.target.value)}
                      className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAdSpend(index)}
                  className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                  aria-label="Remove ad platform"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pl-4 border-l-2 border-muted ml-2">
                <div className="space-y-2">
                  <label 
                    htmlFor={`adReach-${index}`} 
                    className="text-sm font-medium"
                  >
                    Reach
                  </label>
                  <input
                    id={`adReach-${index}`}
                    type="number"
                    min="0"
                    value={ad.reach ?? ''}
                    onChange={(e) => updateAdSpend(index, 'reach', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor={`adClicks-${index}`} 
                    className="text-sm font-medium"
                  >
                    Clicks
                  </label>
                  <input
                    id={`adClicks-${index}`}
                    type="number"
                    min="0"
                    value={ad.clicks ?? ''}
                    onChange={(e) => updateAdSpend(index, 'clicks', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor={`adLeads-${index}`} 
                    className="text-sm font-medium"
                  >
                    Leads
                  </label>
                  <input
                    id={`adLeads-${index}`}
                    type="number"
                    min="0"
                    value={ad.leads ?? ''}
                    onChange={(e) => updateAdSpend(index, 'leads', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Notes</h3>
        
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            placeholder="Any additional notes about this event date..."
          />
        </div>
      </div>
      
      <div className="pt-6 border-t flex justify-end">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAddEntryForm(false)}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Saving...
              </>
            ) : (
              'Save Event Data'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventDataForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Building, 
  Percent, 
  CreditCard, 
  Users, 
  Plus, 
  Trash2,
  ArrowLeft,
  Tag,
  AlertCircle
} from 'lucide-react';
import Container from '../components/layout/Container';
import { 
  DayOfWeek, 
  DealType, 
  PaymentTerms, 
  Partner,
  Event as EventType,
  EventFrequency,
  CommissionBracket
} from '../types';
import { saveEventToDB, generateId } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DEAL_TYPES: DealType[] = ['Revenue Share', 'Revenue Share & Entrance Deal'];

const EVENT_FREQUENCIES: EventFrequency[] = ['Weekly', 'Monthly', 'One Time'];

const PAYMENT_TERMS: PaymentTerms[] = [
  'One week', 'Two weeks', 'Three weeks', 'One month'
];

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  frequency: z.enum(['Weekly', 'Monthly', 'One Time'] as const),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const).optional(),
  date: z.date().optional(),
  venueName: z.string().min(1, "Venue name is required"),
  dealType: z.enum(['Revenue Share', 'Revenue Share & Entrance Deal'] as const),
  isPaidFromEachBracket: z.boolean().default(false),
  entrancePercentage: z.number().min(0).max(100).optional(),
  paymentTerms: z.enum(['One week', 'Two weeks', 'Three weeks', 'One month'] as const)
});

const CreateEvent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [commissionBrackets, setCommissionBrackets] = useState<CommissionBracket[]>([
    { percentage: 15, fromAmount: 0, toAmount: 20000 }
  ]);
  const [partners, setPartners] = useState<Partner[]>([
    { name: '', percentage: 0 }
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      frequency: "Weekly" as const,
      dayOfWeek: "Friday" as const,
      venueName: "",
      dealType: "Revenue Share" as const,
      isPaidFromEachBracket: false,
      paymentTerms: "One week" as const
    }
  });
  
  const dealType = form.watch("dealType");
  const frequency = form.watch("frequency");

  const addCommissionBracket = () => {
    const lastBracket = commissionBrackets[commissionBrackets.length - 1];
    const newFromAmount = lastBracket.toAmount !== null ? lastBracket.toAmount : lastBracket.fromAmount + 20000;
    
    setCommissionBrackets([
      ...commissionBrackets,
      { percentage: 20, fromAmount: newFromAmount, toAmount: newFromAmount + 20000 }
    ]);
  };
  
  const removeCommissionBracket = (index: number) => {
    if (commissionBrackets.length > 1) {
      setCommissionBrackets(commissionBrackets.filter((_, i) => i !== index));
    }
  };
  
  const updateCommissionBracket = (index: number, field: keyof CommissionBracket, value: number | null) => {
    const updatedBrackets = [...commissionBrackets];
    updatedBrackets[index] = { 
      ...updatedBrackets[index], 
      [field]: value 
    };
    setCommissionBrackets(updatedBrackets);
  };
  
  const addPartner = () => {
    setPartners([...partners, { name: '', percentage: 0 }]);
  };
  
  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };
  
  const updatePartner = (index: number, field: keyof Partner, value: string | number) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = { 
      ...updatedPartners[index], 
      [field]: field === 'percentage' ? Number(value) : value 
    };
    setPartners(updatedPartners);
  };

  const validateFormData = (formData: z.infer<typeof formSchema>) => {
    if (formData.frequency !== "Weekly" && !formData.date) {
      toast.error("Please select a date for your event");
      return false;
    }
    
    if (formData.frequency === "Weekly" && !formData.dayOfWeek) {
      toast.error("Please select a day of the week for your weekly event");
      return false;
    }
    
    if (formData.dealType === "Revenue Share & Entrance Deal" && 
        (formData.entrancePercentage === undefined || formData.entrancePercentage <= 0)) {
      toast.error("Please enter a valid entrance percentage for revenue share & entrance deal");
      return false;
    }
    
    for (let i = 0; i < commissionBrackets.length; i++) {
      const bracket = commissionBrackets[i];
      if (bracket.percentage <= 0 || bracket.percentage > 100) {
        toast.error(`Commission percentage for bracket ${i + 1} must be between 1 and 100`);
        return false;
      }
      
      if (bracket.fromAmount < 0) {
        toast.error(`From amount for bracket ${i + 1} must be greater than or equal to 0`);
        return false;
      }
      
      if (bracket.toAmount !== null && bracket.toAmount <= bracket.fromAmount) {
        toast.error(`To amount for bracket ${i + 1} must be greater than from amount`);
        return false;
      }
    }
    
    return true;
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!currentUser?.id) {
      toast.error("You must be logged in to create an event");
      return;
    }
    
    if (!validateFormData(formData)) {
      return;
    }
    
    setLoading(true);
    
    try {
      const filteredPartners = partners.filter(p => p.name.trim() !== '');
      
      const newEvent: EventType = {
        id: generateId(),
        name: formData.name,
        frequency: formData.frequency,
        dayOfWeek: formData.frequency === "Weekly" ? formData.dayOfWeek : undefined,
        date: formData.frequency === "Weekly" 
          ? new Date().toISOString()
          : formData.date?.toISOString() || new Date().toISOString(),
        venueName: formData.venueName,
        location: undefined,
        time: undefined,
        dealType: formData.dealType,
        commissionBrackets: commissionBrackets,
        isPaidFromEachBracket: formData.isPaidFromEachBracket,
        rumbaPercentage: commissionBrackets[0].percentage,
        entrancePercentage: formData.dealType === "Revenue Share & Entrance Deal" 
          ? formData.entrancePercentage 
          : undefined,
        paymentTerms: formData.paymentTerms,
        partners: filteredPartners,
        eventData: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await saveEventToDB(newEvent, currentUser.id);
      
      toast.success("Event created successfully!");
      
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-10 animate-fadeIn">
        <div className="mb-8">
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-1">
            Add details about your nightlife event
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Basic information about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Friday Night Party" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EVENT_FREQUENCIES.map((freq) => (
                              <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {frequency === "Weekly" && (
                    <FormField
                      control={form.control}
                      name="dayOfWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day of Week</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select day of week" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DAYS_OF_WEEK.map((day) => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {(frequency === "Monthly" || frequency === "One Time") && (
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="venueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Skybar" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
                <CardDescription>Details about the commission structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select deal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEAL_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {dealType === "Revenue Share & Entrance Deal" && (
                    <FormField
                      control={form.control}
                      name="entrancePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entrance Revenue Percentage</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                placeholder="e.g., 50" 
                                className="pl-10" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Percentage of entrance revenue you receive</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_TERMS.map((term) => (
                              <SelectItem key={term} value={term}>{term}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Commission Structure</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCommissionBracket}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Bracket
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {commissionBrackets.map((bracket, index) => (
                      <div key={index} className="flex flex-wrap gap-4 items-end">
                        <div className="w-full md:w-24 space-y-2">
                          <label className="text-sm font-medium">Percentage</label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              value={bracket.percentage} 
                              onChange={(e) => updateCommissionBracket(index, 'percentage', Number(e.target.value))} 
                              className="pl-10"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                        
                        <div className="w-full md:w-36 space-y-2">
                          <label className="text-sm font-medium">From (AED)</label>
                          <Input 
                            type="number" 
                            value={bracket.fromAmount} 
                            onChange={(e) => updateCommissionBracket(index, 'fromAmount', Number(e.target.value))} 
                            min="0"
                          />
                        </div>
                        
                        <div className="w-full md:w-36 space-y-2">
                          <label className="text-sm font-medium">To (AED)</label>
                          <Input 
                            type="number" 
                            value={bracket.toAmount === null ? '' : bracket.toAmount} 
                            onChange={(e) => updateCommissionBracket(
                              index, 
                              'toAmount', 
                              e.target.value === '' ? null : Number(e.target.value)
                            )}
                            placeholder="No limit" 
                            min="0"
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCommissionBracket(index)}
                          disabled={commissionBrackets.length === 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isPaidFromEachBracket"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Pay % From Each Bracket</FormLabel>
                          <FormDescription>
                            When enabled, commission is paid according to each revenue bracket
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">How Commission Calculation Works</p>
                      <p>
                        {form.watch("isPaidFromEachBracket") ? (
                          <>
                            <strong>Each bracket applies to its range only.</strong> Example: If revenue is 50,000 AED with brackets 1: 15% (0-40K) and 2: 20% (40K-60K), you'll earn 15% of 40,000 + 20% of 10,000.
                          </>
                        ) : (
                          <>
                            <strong>Single bracket applies to total revenue.</strong> Example: If revenue is 50,000 AED with brackets 1: 15% (0-40K) and 2: 20% (40K-60K), you'll earn 20% of the full 50,000.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Partners Involved</CardTitle>
                  <CardDescription>Add any partners sharing in this event</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPartner}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Partner
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners.map((partner, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <div className="flex-grow space-y-2">
                        <label htmlFor={`partnerName-${index}`} className="text-sm font-medium">
                          Partner Name
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`partnerName-${index}`}
                            value={partner.name}
                            onChange={(e) => updatePartner(index, 'name', e.target.value)}
                            className="pl-10"
                            placeholder="e.g., Partner Co."
                          />
                        </div>
                      </div>
                      <div className="w-32 space-y-2">
                        <label htmlFor={`partnerPercentage-${index}`} className="text-sm font-medium">
                          Percentage
                        </label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`partnerPercentage-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={partner.percentage}
                            onChange={(e) => updatePartner(index, 'percentage', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePartner(index)}
                        disabled={partners.length === 1}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default CreateEvent;

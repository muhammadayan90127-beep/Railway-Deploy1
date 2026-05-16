import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, Loader2, LogIn, QrCode } from 'lucide-react';
import { useGetAvailableSlots, useCreateBooking, getGetAvailableSlotsQueryKey } from '@workspace/api-client-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  service: z.string().min(1, "Service is required"),
  preferredDate: z.date({ required_error: "Date is required" }),
  timeSlot: z.string().min(1, "Time slot is required"),
  budgetRange: z.string().min(1, "Budget is required"),
  projectLocation: z.string().min(2, "Location is required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const BookingSection: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [successData, setSuccessData] = useState<{ consultationId: string; qrCode: string | null } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      service: "",
      timeSlot: "",
      budgetRange: "",
      projectLocation: "",
      message: "",
    },
  });

  const selectedDate = form.watch('preferredDate');
  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const { data: timeSlots, isLoading: isLoadingSlots } = useGetAvailableSlots(
    { date: dateStr },
    { query: { enabled: !!dateStr, queryKey: getGetAvailableSlotsQueryKey({ date: dateStr }) } }
  );

  const createBooking = useCreateBooking();

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createBooking.mutateAsync({
        data: { ...values, preferredDate: format(values.preferredDate, 'yyyy-MM-dd') }
      });
      setSuccessData({ consultationId: (result as any).consultationId, qrCode: (result as any).qrCode ?? null });
    } catch (error: any) {
      form.setError('root', { message: error?.message ?? 'Booking failed. Please try again.' });
    }
  };

  return (
    <section id="booking" className="py-24 bg-background relative">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-foreground" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Book a Consultation
            </motion.h2>
            <motion.div className="w-20 h-1 bg-primary mx-auto mb-6" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
            <p className="font-sans text-foreground/70 font-light text-lg">Take the first step towards your dream space. Schedule a complimentary design discussion with our experts.</p>
          </div>

          <div className="bg-card border border-border p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {successData ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-foreground mb-4">Request Received</h3>
                  <p className="font-sans text-foreground/70 mb-2 max-w-md mx-auto">Thank you for choosing MH Interior Design. Our team will contact you shortly to confirm your consultation.</p>
                  <div className="bg-background/80 border border-border/50 px-6 py-3 rounded my-4">
                    <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Consultation ID</p>
                    <p className="font-serif text-xl font-bold text-primary">{successData.consultationId}</p>
                  </div>
                  {successData.qrCode && (
                    <div className="flex flex-col items-center gap-2 mb-6">
                      <p className="text-xs text-foreground/60 uppercase tracking-wider flex items-center gap-1"><QrCode size={12} /> Scan to verify</p>
                      <img src={successData.qrCode} alt="QR Code" className="w-40 h-40 border border-border/50 p-2 bg-white" />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none" onClick={() => { form.reset(); setSuccessData(null); }}>Book Another</Button>
                    <Button className="rounded-none" onClick={() => setLocation('/dashboard')}>View My Bookings</Button>
                  </div>
                </motion.div>
              ) : !user ? (
                <motion.div key="login-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <LogIn className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Login to Book a Consultation</h3>
                  <p className="font-sans text-foreground/70 mb-8 max-w-md">Create an account or sign in to book your consultation. You'll also get access to booking history and QR codes.</p>
                  <div className="flex gap-4">
                    <Button className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8" onClick={() => setLocation('/login')}>Login</Button>
                    <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12 px-8" onClick={() => setLocation('/register')}>Create Account</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="booking-form">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Full Name</FormLabel><FormControl><Input placeholder="John Doe" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Phone Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Email Address</FormLabel><FormControl><Input placeholder="john@example.com" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="service" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Service Required</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-background border-border rounded-none focus:ring-primary"><SelectValue placeholder="Select a service" /></SelectTrigger></FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="Residential Interior">Residential Interior</SelectItem>
                                <SelectItem value="Commercial Interior">Commercial Interior</SelectItem>
                                <SelectItem value="Modular Kitchen">Modular Kitchen</SelectItem>
                                <SelectItem value="False Ceiling & Lighting">False Ceiling & Lighting</SelectItem>
                                <SelectItem value="Custom Furniture">Custom Furniture</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select><FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="preferredDate" render={({ field }) => (
                          <FormItem className="flex flex-col"><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70 mt-[4px]">Preferred Date</FormLabel>
                            <Popover><PopoverTrigger asChild><FormControl>
                              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal bg-background border-border rounded-none hover:bg-background/80 hover:text-foreground", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl></PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                              </PopoverContent>
                            </Popover><FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="timeSlot" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Time Slot</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {!selectedDate ? <div className="col-span-3 text-sm text-foreground/50 py-2">Please select a date first</div>
                                : isLoadingSlots ? <div className="col-span-3 text-sm text-primary py-2 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading slots...</div>
                                : timeSlots && timeSlots.length > 0 ? timeSlots.map((slot) => (
                                  <button type="button" key={(slot as any).time} disabled={!(slot as any).available} onClick={() => field.onChange((slot as any).time)}
                                    className={cn("py-2 px-3 text-sm border font-sans transition-all text-center", field.value === (slot as any).time ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/80 hover:border-primary/50", !(slot as any).available && "opacity-30 cursor-not-allowed hover:border-border")}>
                                    {(slot as any).label || (slot as any).time}
                                  </button>
                                )) : <div className="col-span-3 text-sm text-destructive py-2">No slots available</div>}
                            </div><FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="budgetRange" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-background border-border rounded-none focus:ring-primary"><SelectValue placeholder="Select budget" /></SelectTrigger></FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="Under ₹2L">Under ₹2L</SelectItem>
                                <SelectItem value="₹2L – 5L">₹2L – 5L</SelectItem>
                                <SelectItem value="₹5L – 10L">₹5L – 10L</SelectItem>
                                <SelectItem value="₹10L+">₹10L+</SelectItem>
                              </SelectContent>
                            </Select><FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="projectLocation" render={({ field }) => (
                          <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Project Location / City</FormLabel><FormControl><Input placeholder="e.g. Amroha, Moradabad" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem><FormLabel className="font-sans uppercase tracking-wider text-xs text-foreground/70">Message (Optional)</FormLabel><FormControl><Textarea placeholder="Briefly describe your project..." className="bg-background border-border rounded-none focus-visible:ring-primary resize-none h-24" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      {form.formState.errors.root && (
                        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">
                          {form.formState.errors.root.message}
                        </div>
                      )}
                      <Button type="submit" disabled={createBooking.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 font-serif text-lg tracking-wide" data-testid="booking-submit">
                        {createBooking.isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Request...</> : "Confirm Booking Request"}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

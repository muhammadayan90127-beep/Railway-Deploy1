import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitContact } from '@workspace/api-client-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactSection: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const submitContact = useSubmitContact();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { service: "" }
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate({ data }, {
      onSuccess: () => { setIsSuccess(true); reset(); setTimeout(() => setIsSuccess(false), 5000); }
    });
  };

  return (
    <section id="contact" className="py-24 bg-card border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">Let's Discuss <br /> Your Space</h2>
            <div className="w-20 h-1 bg-primary mb-8" />
            <p className="font-sans text-foreground/70 font-light text-lg mb-10 leading-relaxed">Ready to transform your space? Reach out to us for a consultation. Our design experts will get back to you within 24 hours.</p>
            <div className="flex flex-col gap-8 mb-12">
              {[
                { Icon: MapPin, title: 'Studio Location', text: 'Amroha, Uttar Pradesh, India' },
                { Icon: Phone, title: 'Call Us', text: '+91 96902 88828', href: 'tel:+919690288828' },
                { Icon: Mail, title: 'Email', text: 'mhinteriordesign@gmail.com', href: 'mailto:mhinteriordesign@gmail.com' },
                { Icon: Clock, title: 'Working Hours', text: 'Mon–Sat: 10:00 AM – 7:00 PM' },
              ].map(({ Icon, title, text, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none border border-primary/20 bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-foreground mb-1 text-lg">{title}</h4>
                    {href ? <p className="font-sans text-foreground/60"><a href={href} className="hover:text-primary transition-colors">{text}</a></p> : <p className="font-sans text-foreground/60">{text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-background/80 backdrop-blur-md border border-border/50 p-8 relative overflow-hidden" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                  <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">Message Sent Successfully!</h3>
                  <p className="text-foreground/70 mb-8 max-w-md">Thank you for reaching out to MH Interior Design. One of our design experts will contact you shortly.</p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)} className="border-primary/50 text-primary">Send Another Message</Button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold mb-6">Send us a message</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input placeholder="Your Name *" {...register("name")} className="bg-card border-border/50 focus-visible:ring-primary h-12" />
                      {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Phone Number *" {...register("phone")} className="bg-card border-border/50 focus-visible:ring-primary h-12" />
                      {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input placeholder="Email Address *" type="email" {...register("email")} className="bg-card border-border/50 focus-visible:ring-primary h-12" />
                      {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Controller name="service" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-card border-border/50 focus-visible:ring-primary h-12"><SelectValue placeholder="Interested Service *" /></SelectTrigger>
                          <SelectContent>
                            {['Full Home Interior', 'Modular Kitchen', 'Office / Commercial', 'False Ceiling & Lighting', 'Custom Furniture', 'Other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )} />
                      {errors.service && <p className="text-destructive text-xs">{errors.service.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Textarea placeholder="Tell us about your project... *" {...register("message")} className="min-h-[150px] bg-card border-border/50 focus-visible:ring-primary resize-none" />
                    {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-medium tracking-wide flex items-center justify-center gap-2 group" disabled={submitContact.isPending}>
                    {submitContact.isPending ? "Sending..." : <><span>Send Message</span><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <a href="https://wa.me/919690288828" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300" aria-label="Chat on WhatsApp" data-testid="whatsapp-button">
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </section>
  );
};

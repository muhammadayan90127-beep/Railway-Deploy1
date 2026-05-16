import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitReview } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().optional(),
  rating: z.number().min(1).max(5),
  message: z.string().min(10, "Review must be at least 10 characters")
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps { onClose: () => void; }

export const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const submitReview = useSubmitReview();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, city: '' }
  });

  const onSubmit = (data: ReviewFormValues) => {
    submitReview.mutate({ data }, {
      onSuccess: () => { setIsSuccess(true); setTimeout(() => onClose(), 3000); },
      onError: () => toast({ title: "Error submitting review", description: "Please try again later.", variant: "destructive" })
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg bg-card border border-border/50 rounded-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close"><X className="w-6 h-6" /></button>
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"><Star className="w-8 h-8 fill-primary text-primary" /></div>
                <h3 className="font-serif text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your review has been submitted and is pending approval.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-serif text-2xl font-bold mb-2 text-foreground">Share Your Experience</h3>
                <p className="text-muted-foreground mb-8 text-sm">We'd love to hear about your experience working with us.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center mb-8">
                    <p className="text-sm font-medium mb-2 text-foreground/80">Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => { setRating(star); setValue('rating', star); }} className="focus:outline-none transition-transform hover:scale-110">
                          <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted-foreground fill-none"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input placeholder="Your Name *" {...register("name")} className="bg-background border-border/50 focus-visible:ring-primary" />
                      {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                    </div>
                    <Input placeholder="City (Optional)" {...register("city")} className="bg-background border-border/50 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Textarea placeholder="Tell us about your experience... *" {...register("message")} className="min-h-[120px] bg-background border-border/50 focus-visible:ring-primary resize-none" />
                    {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={submitReview.isPending}>
                    {submitReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useListApprovedReviews, getListApprovedReviewsQueryKey } from '@workspace/api-client-react';
import { ReviewForm } from './ReviewForm';

const fallbackTestimonials = [
  { name: 'Rahul Sharma', city: 'Amroha', rating: 5, message: 'MH Interior Design completely transformed our old family home into a modern masterpiece while preserving its soul. The attention to detail is unmatched.' },
  { name: 'Priya Verma', city: 'Moradabad', rating: 5, message: 'The team was incredibly professional. They delivered our modular kitchen on time and exactly as shown in the 3D renders. Absolutely delighted!' },
  { name: 'Vikram Singh', city: 'Gajraula', rating: 5, message: "We hired them for our office space. The way they optimized the layout has genuinely improved our team's productivity. Highly recommended." },
];

export const TestimonialsSection: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const { data: approvedReviews } = useListApprovedReviews({ query: { queryKey: getListApprovedReviewsQueryKey() } });
  const displayReviews = approvedReviews && approvedReviews.length > 0 ? approvedReviews : fallbackTestimonials;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { clearInterval(interval); emblaApi.off('select', onSelect); };
  }, [emblaApi, displayReviews.length]);

  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <motion.h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-foreground" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Client Stories
            </motion.h2>
            <motion.div className="w-20 h-1 bg-primary" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
          </div>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setIsReviewFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Write a Review
          </Button>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {displayReviews.map((item, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 min-w-0">
                <Card className="h-full bg-card/80 backdrop-blur-md border-border/50 rounded-none relative transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(201,169,110,0.05)]">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-6">
                      {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                    </div>
                    <p className="font-sans text-foreground/80 font-light italic mb-8 flex-grow leading-relaxed">"{item.message}"</p>
                    <div className="mt-auto">
                      <h4 className="font-serif font-bold text-foreground text-lg">{item.name}</h4>
                      {item.city && <p className="font-sans text-sm text-primary uppercase tracking-wider">{item.city}</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-3">
          {displayReviews.map((_, idx) => (
            <button key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'}`} onClick={() => emblaApi?.scrollTo(idx)} aria-label={`Go to slide ${idx + 1}`} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isReviewFormOpen && <ReviewForm onClose={() => setIsReviewFormOpen(false)} />}
      </AnimatePresence>
    </section>
  );
};

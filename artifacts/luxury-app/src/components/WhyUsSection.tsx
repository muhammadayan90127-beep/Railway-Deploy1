import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Clock, Gem, Cuboid, CalendarCheck, Lightbulb, Compass } from 'lucide-react';

const usps = [
  { icon: MapPin, title: 'Local Amroha Expertise', desc: 'Deep understanding of local architecture and material sourcing.' },
  { icon: IndianRupee, title: 'Affordable Luxury', desc: 'Premium aesthetics optimized for your specific budget.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Strict adherence to project timelines without compromising quality.' },
  { icon: Gem, title: 'Premium Materials', desc: 'Sourcing the finest woods, fabrics, and hardware.' },
  { icon: Cuboid, title: '3D Visualization', desc: 'See exactly what you get before execution begins.' },
  { icon: CalendarCheck, title: 'Free Consultation', desc: 'No-obligation initial design discussion and site visit.' },
  { icon: Lightbulb, title: 'Modern Concepts', desc: 'Staying ahead of global interior design trends.' },
  { icon: Compass, title: 'Vastu Compliance', desc: 'Aligning modern living with ancient principles.' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export const WhyUsSection: React.FC = () => {
  return (
    <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <motion.h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              Why Choose Us
            </motion.h2>
            <motion.div className="w-20 h-1 bg-primary mb-8" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
            <motion.p className="font-sans text-foreground/70 font-light text-lg mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              We don't just decorate rooms; we engineer lifestyles. Here is why MH Interior Design is the trusted choice for luxury interiors in Amroha and beyond.
            </motion.p>
          </div>
          <motion.div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            {usps.map((usp, idx) => {
              const Icon = usp.icon;
              return (
                <motion.div key={idx} variants={itemVariants} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-background/50">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">{usp.title}</h3>
                    <p className="font-sans text-sm text-foreground/60 font-light leading-relaxed">{usp.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

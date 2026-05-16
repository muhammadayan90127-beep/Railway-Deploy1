import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, UtensilsCrossed, SquareSquare, PaintBucket, Sofa, Compass, LayoutDashboard, Cuboid, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  { icon: Home, title: 'Residential Interior', desc: 'Bespoke luxury homes tailored to your lifestyle.' },
  { icon: Building2, title: 'Commercial Interior', desc: 'Inspiring workspaces that elevate brand identity.' },
  { icon: UtensilsCrossed, title: 'Modular Kitchen', desc: 'Sleek, functional, and highly durable culinary spaces.' },
  { icon: SquareSquare, title: 'False Ceiling', desc: 'Architectural lighting and ceiling designs.' },
  { icon: PaintBucket, title: 'Wallpaper & Texture', desc: 'Premium wall treatments and artistic finishes.' },
  { icon: Sofa, title: 'Furniture Design', desc: 'Custom handcrafted furniture pieces.' },
  { icon: Compass, title: 'Vastu-Based Layouts', desc: 'Harmonious designs aligned with traditional principles.' },
  { icon: LayoutDashboard, title: 'Space Planning', desc: 'Optimizing flow and spatial efficiency.' },
  { icon: Cuboid, title: '3D Visualization', desc: 'Photorealistic renders before execution.' },
  { icon: Sparkles, title: 'Smart Luxury', desc: 'Home automation integrated seamlessly into design.' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-foreground" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            Our Expertise
          </motion.h2>
          <motion.div className="w-20 h-1 bg-primary mx-auto" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className="h-full">
                <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden relative cursor-pointer rounded-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardContent className="p-6 flex flex-col items-center text-center h-full pt-8 relative z-10">
                    <div className="mb-6 p-4 rounded-full bg-background border border-border group-hover:border-primary group-hover:bg-primary/5 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="font-sans text-sm text-foreground/60 font-light">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Luxury Villa', 'Commercial'];

const portfolioItems = [
  { id: 1, category: 'Living Room', src: '/portfolio/living-1.png', title: 'Modern Minimalist Lounge', aspect: 'aspect-[16/9]' },
  { id: 2, category: 'Bedroom', src: '/portfolio/bedroom-1.png', title: 'Serene Master Suite', aspect: 'aspect-[16/9]' },
  { id: 3, category: 'Kitchen', src: '/portfolio/kitchen-2.png', title: 'Gourmet Modular Kitchen', aspect: 'aspect-[4/3]' },
  { id: 4, category: 'Living Room', src: '/portfolio/living-2.png', title: 'Heritage Living Space', aspect: 'aspect-[3/4]' },
  { id: 5, category: 'Office', src: '/portfolio/office-1.png', title: 'Executive Workspace', aspect: 'aspect-[16/9]' },
  { id: 6, category: 'Bedroom', src: '/portfolio/bedroom-2.png', title: 'Boutique Guest Room', aspect: 'aspect-[3/4]' },
  { id: 7, category: 'Luxury Villa', src: '/portfolio/villa-1.png', title: 'Grand Foyer Entry', aspect: 'aspect-[16/9]' },
  { id: 8, category: 'Kitchen', src: '/portfolio/kitchen-1.png', title: 'Open Plan Dining', aspect: 'aspect-[16/9]' },
  { id: 9, category: 'Commercial', src: '/portfolio/commercial-1.png', title: 'Premium Retail Showroom', aspect: 'aspect-[16/9]' },
];

export const PortfolioSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof portfolioItems[0] | null>(null);

  const filteredItems = activeCategory === 'All' ? portfolioItems : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-card relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <motion.h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-foreground" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              Selected Works
            </motion.h2>
            <div className="w-20 h-1 bg-primary" />
          </div>
          <motion.div className="flex flex-wrap gap-2 md:gap-4" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-sans tracking-wide transition-all border ${activeCategory === cat ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 text-foreground/70 hover:border-primary/50 hover:text-foreground'}`} data-testid={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}>
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden bg-background cursor-pointer" onClick={() => setSelectedImage(item)}>
                <div className={`${item.aspect} overflow-hidden`}>
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <p className="font-sans text-xs text-primary uppercase tracking-wider mb-1">{item.category}</p>
                      <h3 className="font-serif text-lg font-bold text-foreground">{item.title}</h3>
                    </div>
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm flex items-center justify-center text-primary">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl" onClick={() => setSelectedImage(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2 font-sans text-sm">
                <X size={20} /> Close
              </button>
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain max-h-[80vh]" />
              <div className="mt-4">
                <p className="font-sans text-xs text-primary uppercase tracking-wider">{selectedImage.category}</p>
                <h3 className="font-serif text-2xl font-bold text-foreground">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

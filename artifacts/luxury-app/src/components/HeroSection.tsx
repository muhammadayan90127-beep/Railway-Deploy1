import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-background">
      <motion.div
        className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] z-0"
        style={{ y }}
        animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 1 }}
      >
        <div className="absolute inset-0 bg-background/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img src="/hero-bg.png" alt="Luxury Interior Design" className="w-full h-full object-cover" loading="eager" />
      </motion.div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-xl"
            style={{ width: Math.random() * 200 + 50, height: Math.random() * 200 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ x: [0, Math.random() * 100 - 50, 0], y: [0, Math.random() * 100 - 50, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <motion.div className="container mx-auto px-4 z-20 flex flex-col items-center text-center mt-20" style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <span className="font-sans text-sm md:text-base uppercase tracking-[0.3em] text-primary mb-6 block">Amroha's Premier Design Studio</span>
        </motion.div>
        <motion.h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
        >
          MH INTERIOR <br /> DESIGN
        </motion.h1>
        <motion.p
          className="font-sans text-lg md:text-xl text-foreground/80 max-w-2xl font-light mb-12"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
        >
          Transforming Spaces, Inspiring Lives. We blend modern Indian sensibility with global luxury aesthetics to create timeless environments.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
          <Button size="lg" variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif tracking-wide h-14 px-8" onClick={() => scrollTo('#portfolio')} data-testid="hero-btn-portfolio">
            Explore Our Work
          </Button>
          <Button size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif tracking-wide h-14 px-8" onClick={() => scrollTo('#booking')} data-testid="hero-btn-book">
            Book Free Consultation
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
        onClick={() => scrollTo('#about')}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2 text-foreground/60 hover:text-primary transition-colors">
          <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

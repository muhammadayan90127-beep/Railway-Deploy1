import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const counters = [
  { value: 8, label: 'Years Experience', suffix: '+' },
  { value: 500, label: 'Projects Completed', suffix: '+' },
  { value: 300, label: 'Happy Clients', suffix: '+' },
  { value: 12, label: 'Cities Served', suffix: '' },
];

const Counter: React.FC<{ value: number; suffix: string; inView: boolean }> = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const incrementTime = (duration / end) * 2;
    const timer = setInterval(() => {
      start += 1;
      setCount((prev) => {
        if (prev + 1 >= end) { clearInterval(timer); return end; }
        return prev + 1;
      });
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, inView]);

  return <span className="font-serif text-4xl md:text-5xl font-bold text-primary">{count}{suffix}</span>;
};

export const AboutSection: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">Crafting Stories <br /> Through Spaces.</h2>
            <div className="w-20 h-1 bg-primary mb-8" />
            <p className="font-sans text-foreground/80 font-light text-lg mb-6 leading-relaxed">
              At MH Interior Design, we believe that luxury is not just about what you see, but how a space makes you feel. Founded in the historic city of Amroha, we bring a meticulous eye for detail to every residential and commercial project.
            </p>
            <p className="font-sans text-foreground/80 font-light text-lg mb-10 leading-relaxed">
              Our philosophy marries the rich heritage of Indian craftsmanship with contemporary global aesthetics, ensuring your space is unhurried, tactile, and deeply personal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-serif text-xl text-primary mb-2">Our Vision</h3>
                <p className="font-sans text-sm text-foreground/70">To redefine luxury living in Northern India by creating spaces that inspire, comfort, and elevate everyday life.</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-serif text-xl text-primary mb-2">Our Mission</h3>
                <p className="font-sans text-sm text-foreground/70">Delivering impeccable design solutions with transparency, premium materials, and unparalleled craftsmanship.</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-6" initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
            {counters.map((counter, idx) => (
              <div key={idx} className="bg-background/50 p-8 border border-border/50 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                <Counter value={counter.value} suffix={counter.suffix} inView={isInView} />
                <span className="font-sans text-sm text-foreground/70 mt-2 uppercase tracking-wider">{counter.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
      else { setLocation('/'); setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100); }
    } else {
      setLocation(href);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setLocation('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${isScrolled ? 'bg-background/80 backdrop-blur-md border-border/50 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex flex-col cursor-pointer" onClick={() => scrollTo('#hero')} data-testid="nav-logo">
          <span className="font-serif text-2xl font-bold tracking-wider text-primary">MH</span>
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-foreground/80">Interior Design</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => scrollTo(item.href)} className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300" data-testid={`nav-link-${item.name.toLowerCase()}`}>
              {item.name}
            </button>
          ))}
          <Button onClick={() => scrollTo('#booking')} className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif tracking-wide px-6" data-testid="nav-btn-book">
            Book Consultation
          </Button>

          {user ? (
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 font-sans text-sm text-foreground/80 hover:text-primary transition-colors border border-border/50 rounded-full px-4 py-2 hover:border-primary/50">
                <User size={16} />
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 shadow-xl py-1 z-50">
                    <button onClick={() => { setLocation('/dashboard'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors text-left">
                      <LayoutDashboard size={15} /> My Dashboard
                    </button>
                    <button onClick={() => { setLocation('/settings'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors text-left">
                      <Settings size={15} /> Account Settings
                    </button>
                    <div className="border-t border-border/50 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-destructive hover:bg-destructive/5 transition-colors text-left">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={() => setLocation('/login')} className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300 border border-border/50 rounded-full px-4 py-2 hover:border-primary/50">
              Login
            </button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="nav-mobile-toggle">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/50 overflow-hidden">
            <div className="flex flex-col px-4 py-6 gap-4">
              {navItems.map((item) => (
                <button key={item.name} onClick={() => scrollTo(item.href)} className="font-sans text-lg font-medium text-foreground hover:text-primary transition-colors text-left">
                  {item.name}
                </button>
              ))}
              <Button onClick={() => scrollTo('#booking')} className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif w-full">Book Consultation</Button>
              <div className="border-t border-border/50 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <button onClick={() => { setLocation('/dashboard'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 py-2 text-sm font-sans text-foreground/80 hover:text-primary transition-colors text-left"><LayoutDashboard size={15} /> My Dashboard</button>
                    <button onClick={() => { setLocation('/settings'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 py-2 text-sm font-sans text-foreground/80 hover:text-primary transition-colors text-left"><Settings size={15} /> Account Settings</button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 py-2 text-sm font-sans text-destructive transition-colors text-left"><LogOut size={15} /> Sign Out</button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setLocation('/login'); setIsMobileMenuOpen(false); }} className="flex-1 rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground">Login</Button>
                    <Button onClick={() => { setLocation('/register'); setIsMobileMenuOpen(false); }} className="flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90">Register</Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

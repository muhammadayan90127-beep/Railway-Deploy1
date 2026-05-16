import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Settings, QrCode, Home, ChevronDown, ChevronUp, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

interface Booking {
  id: number;
  consultationId: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  timeSlot: string;
  budgetRange: string;
  projectLocation: string;
  message: string | null;
  status: string;
  qrCode: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const DashboardPage: React.FC = () => {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { setLocation("/login"); return; }
    if (token) {
      fetch(`${BASE_PATH}/api/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setBookings(data); })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [user, token, authLoading]);

  const handleLogout = () => { logout(); setLocation("/"); };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-foreground/60 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex flex-col cursor-pointer">
            <span className="font-serif text-xl font-bold tracking-wider text-primary">MH</span>
            <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-foreground/70">Interior Design</span>
          </button>
          <h1 className="font-serif text-lg font-bold text-foreground hidden md:block">My Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/settings")} className="text-foreground/70 hover:text-foreground">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-foreground/70 hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-1">Welcome, {user?.name.split(' ')[0]}</h2>
          <p className="font-sans text-foreground/60 text-sm">{user?.email}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border/50 p-4 text-center">
              <p className="font-serif text-3xl font-bold text-primary">{value}</p>
              <p className="font-sans text-xs text-foreground/60 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div>
          <h3 className="font-serif text-xl font-bold text-foreground mb-6">Your Consultations</h3>
          {bookings.length === 0 ? (
            <div className="bg-card border border-border/50 p-12 text-center">
              <Calendar className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <h4 className="font-serif text-xl text-foreground/60 mb-2">No bookings yet</h4>
              <p className="font-sans text-sm text-foreground/40 mb-6">Book your first free consultation with our design experts.</p>
              <Button className="rounded-none" onClick={() => { setLocation("/"); setTimeout(() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' }), 300); }}>
                <Home className="w-4 h-4 mr-2" /> Book a Consultation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, idx) => (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border/50 overflow-hidden">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={statusColors[booking.status] ?? ""}>{booking.status}</Badge>
                        <span className="font-sans text-xs text-foreground/40">{booking.consultationId}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-foreground">{booking.service}</h4>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-foreground/60">
                        <span className="flex items-center gap-1"><Calendar size={13} /> {booking.preferredDate}</span>
                        <span className="flex items-center gap-1"><Clock size={13} /> {booking.timeSlot}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} /> {booking.projectLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.qrCode && <QrCode className="w-5 h-5 text-primary/60" />}
                      {expandedId === booking.id ? <ChevronUp size={18} className="text-foreground/40" /> : <ChevronDown size={18} className="text-foreground/40" />}
                    </div>
                  </div>

                  {expandedId === booking.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-border/50 p-5 bg-background/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          {[
                            ['Budget Range', booking.budgetRange],
                            ['Contact Email', booking.email],
                            ['Phone', booking.phone],
                            ...(booking.message ? [['Message', booking.message]] : []),
                          ].map(([k, v]) => (
                            <div key={k}>
                              <p className="font-sans text-xs text-foreground/40 uppercase tracking-wider">{k}</p>
                              <p className="font-sans text-sm text-foreground/80 mt-0.5">{v}</p>
                            </div>
                          ))}
                          <div>
                            <p className="font-sans text-xs text-foreground/40 uppercase tracking-wider">Booked On</p>
                            <p className="font-sans text-sm text-foreground/80 mt-0.5">{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        {booking.qrCode && (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <p className="font-sans text-xs text-foreground/60 uppercase tracking-wider">Verification QR Code</p>
                            <img src={booking.qrCode} alt="QR Code" className="w-40 h-40 border border-border/50 p-2 bg-white rounded" />
                            <p className="font-sans text-xs text-foreground/40 text-center">Show this code for on-site verification</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

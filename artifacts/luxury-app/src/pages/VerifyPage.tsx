import React, { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, CheckCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string; bg: string; desc: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending", desc: "This consultation is awaiting confirmation from our team." },
  confirmed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Confirmed", desc: "This consultation has been confirmed. Please arrive on time." },
  completed: { icon: CheckCheck, color: "text-blue-500", bg: "bg-blue-500/10", label: "Completed", desc: "This consultation has been successfully completed." },
  rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Not Confirmed", desc: "This consultation was not confirmed. Please contact us for details." },
};

export const VerifyPage: React.FC = () => {
  const [match, params] = useRoute("/verify/:consultationId");
  const [, setLocation] = useLocation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const consultationId = params?.consultationId;

  useEffect(() => {
    if (!consultationId) return;
    fetch(`${BASE_PATH}/api/bookings/verify/${consultationId}`)
      .then(r => r.json())
      .then(data => {
        if (data.booking) { setBooking(data.booking); }
        else { setNotFound(true); }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [consultationId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-foreground/60 text-sm">Verifying booking...</p>
        </div>
      </div>
    );
  }

  const config = booking ? (statusConfig[booking.status] ?? statusConfig.pending) : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <button onClick={() => setLocation("/")} className="inline-flex flex-col items-center cursor-pointer mb-4 group">
            <span className="font-serif text-3xl font-bold tracking-wider text-primary">MH</span>
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-foreground/70">Interior Design</span>
          </button>
          <h1 className="font-serif text-2xl font-bold text-foreground">Booking Verification</h1>
        </div>

        {notFound ? (
          <div className="bg-card border border-border/50 p-10 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><XCircle className="w-10 h-10 text-red-500" /></div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Booking Not Found</h2>
            <p className="font-sans text-foreground/60 mb-6">The consultation ID <strong className="text-foreground">{consultationId}</strong> was not found in our records.</p>
            <Button onClick={() => setLocation("/")} className="rounded-none"><Home className="w-4 h-4 mr-2" /> Return Home</Button>
          </div>
        ) : booking && config ? (
          <div className="bg-card border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="p-8">
              {/* Status */}
              <div className={`${config.bg} flex items-center gap-4 p-4 rounded mb-6`}>
                <config.icon className={`w-8 h-8 ${config.color} flex-shrink-0`} />
                <div>
                  <p className={`font-serif text-xl font-bold ${config.color}`}>{config.label}</p>
                  <p className="font-sans text-sm text-foreground/70">{config.desc}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 border-t border-border/50 pt-6">
                <p className="font-sans text-xs text-foreground/40 uppercase tracking-wider mb-4">Consultation Details</p>
                {[
                  ['Consultation ID', booking.consultationId],
                  ['Client Name', booking.fullName],
                  ['Service', booking.service],
                  ['Date', booking.preferredDate],
                  ['Time', booking.timeSlot],
                  ['Location', booking.projectLocation],
                  ['Budget', booking.budgetRange],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="font-sans text-xs text-foreground/50 uppercase tracking-wider">{k}</span>
                    <span className="font-sans text-sm text-foreground font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="font-sans text-xs text-foreground/50 uppercase tracking-wider">Booked On</span>
                  <span className="font-sans text-sm text-foreground font-medium">{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-border/50 p-5 flex justify-center">
              <Button variant="outline" onClick={() => setLocation("/")} className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default VerifyPage;

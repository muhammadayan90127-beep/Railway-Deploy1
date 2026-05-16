import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

export const SettingsPage: React.FC = () => {
  const { user, token, logout, updateUser, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  React.useEffect(() => {
    if (!authLoading && !user) { setLocation("/login"); }
  }, [user, authLoading]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setProfileLoading(true);
    setProfileSuccess(false);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: data.error ?? "Failed to update profile", variant: "destructive" }); return; }
      updateUser(data);
      setProfileSuccess(true);
      toast({ title: "Profile updated successfully" });
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (!currentPassword || !newPassword) { setPwError("Please fill in all fields"); return; }
    if (newPassword.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    setPwLoading(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error ?? "Failed to change password"); return; }
      toast({ title: "Password changed successfully" });
      setCurrentPassword(""); setNewPassword("");
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex flex-col cursor-pointer">
            <span className="font-serif text-xl font-bold tracking-wider text-primary">MH</span>
            <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-foreground/70">Interior Design</span>
          </button>
          <h1 className="font-serif text-lg font-bold text-foreground hidden md:block">Account Settings</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-foreground/70 hover:text-foreground"><LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard</Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); setLocation("/"); }} className="text-foreground/70 hover:text-foreground"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Profile Info */}
          <div className="bg-card border border-border/50 p-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Email Address <span className="text-foreground/40 text-xs">(read-only)</span></label>
                <Input value={user?.email ?? ""} disabled className="bg-background border-border/50 rounded-none h-12 opacity-50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12" />
              </div>
              <Button type="submit" disabled={profileLoading} className="rounded-none h-11 px-8">
                {profileLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                  : profileSuccess ? <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Saved!</>
                  : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-card border border-border/50 p-8">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Current Password</label>
                <div className="relative">
                  <Input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12 pr-12" />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">New Password</label>
                <div className="relative">
                  <Input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12 pr-12" />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {pwError && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">{pwError}</div>}
              <Button type="submit" disabled={pwLoading} variant="outline" className="rounded-none h-11 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Changing...</> : "Change Password"}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;

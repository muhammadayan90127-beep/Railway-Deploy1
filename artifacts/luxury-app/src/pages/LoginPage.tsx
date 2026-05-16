import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');
type Mode = "login" | "forgot" | "reset";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const search = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("reset_token");
    if (token) { setResetToken(token); setMode("reset"); }
  }, [search]);

  const switchMode = (m: Mode) => { setMode(m); setError(""); setForgotSent(false); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      login(data.user, data.token);
      toast({ title: `Welcome back, ${data.user.name.split(' ')[0]}!` });
      setLocation("/");
    } catch { setError("Network error. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!forgotEmail) { setError("Please enter your email"); return; }
    setIsLoading(true);
    try {
      await fetch(`${BASE_PATH}/api/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: forgotEmail }) });
      setForgotSent(true);
    } catch { setError("Network error. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!newPassword) { setError("Please enter a new password"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: resetToken, newPassword }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Reset failed"); return; }
      setResetDone(true);
      toast({ title: "Password reset successfully!" });
    } catch { setError("Network error. Please try again."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <button onClick={() => setLocation("/")} className="inline-flex flex-col items-center cursor-pointer mb-6 group">
            <span className="font-serif text-4xl font-bold tracking-wider text-primary group-hover:opacity-90 transition-opacity">MH</span>
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-foreground/70">Interior Design</span>
          </button>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {mode === "login" ? "Welcome Back" : mode === "forgot" ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="font-sans text-foreground/60 text-sm">
            {mode === "login" ? "Sign in to manage your consultations" : mode === "forgot" ? "Enter your email to receive a reset link" : "Enter your new password below"}
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <AnimatePresence mode="wait">

            {/* LOGIN */}
            {mode === "login" && (
              <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Email Address</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Password</label>
                    <button type="button" onClick={() => switchMode("forgot")} className="font-sans text-xs text-primary hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12 pr-12" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">{error}</div>}
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide mt-2">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing In...</> : "Sign In"}
                </Button>
                <div className="mt-6 text-center space-y-3">
                  <p className="font-sans text-sm text-foreground/60">Don't have an account?{" "}<button type="button" onClick={() => setLocation("/register")} className="text-primary hover:underline font-medium">Create one</button></p>
                  <button type="button" onClick={() => setLocation("/")} className="font-sans text-xs text-foreground/40 hover:text-foreground transition-colors">← Back to home</button>
                </div>
              </motion.form>
            )}

            {/* FORGOT PASSWORD */}
            {mode === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {!forgotSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-2">
                      <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Email Address</label>
                      <Input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12" autoComplete="email" />
                    </div>
                    {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">{error}</div>}
                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide">
                      {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...</> : "Send Reset Link"}
                    </Button>
                    <div className="text-center mt-4">
                      <button type="button" onClick={() => switchMode("login")} className="font-sans text-xs text-foreground/40 hover:text-foreground transition-colors">← Back to login</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                      <span className="text-primary text-2xl">✓</span>
                    </div>
                    <div>
                      <p className="font-serif text-foreground text-lg mb-2">Check your inbox</p>
                      <p className="font-sans text-sm text-foreground/60">If <strong>{forgotEmail}</strong> is registered, a reset link has been sent. It expires in 1 hour.</p>
                    </div>
                    <button type="button" onClick={() => switchMode("login")} className="font-sans text-sm text-primary hover:underline">← Back to login</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {mode === "reset" && (
              <motion.div key="reset" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {!resetDone ? (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">New Password</label>
                      <div className="relative">
                        <Input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12 pr-12" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">{error}</div>}
                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide">
                      {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Resetting...</> : "Set New Password"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                      <span className="text-primary text-2xl">✓</span>
                    </div>
                    <p className="font-serif text-foreground text-lg">Password Reset!</p>
                    <p className="font-sans text-sm text-foreground/60">Your password has been changed successfully.</p>
                    <Button onClick={() => switchMode("login")} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide">Sign In Now</Button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

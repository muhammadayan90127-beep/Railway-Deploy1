import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      login(data.user, data.token);
      toast({ title: `Welcome back, ${data.user.name.split(' ')[0]}!` });
      setLocation("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="font-sans text-foreground/60 text-sm">Sign in to manage your consultations</p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Email Address</label>
              <Input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-foreground/70">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="bg-background border-border/50 rounded-none focus-visible:ring-primary h-12 pr-12"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded">{error}</div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide mt-2">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing In...</> : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="font-sans text-sm text-foreground/60">
              Don't have an account?{" "}
              <button onClick={() => setLocation("/register")} className="text-primary hover:underline font-medium">Create one</button>
            </p>
            <button onClick={() => setLocation("/")} className="font-sans text-xs text-foreground/40 hover:text-foreground transition-colors">← Back to home</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

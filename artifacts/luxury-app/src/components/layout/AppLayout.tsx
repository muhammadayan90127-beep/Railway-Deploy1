import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-wider text-primary">
            LUXE INTERIORS
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </Link>
            {user ? (
              <>
                <Link href="/book" className={`text-sm hover:text-primary transition-colors ${location === '/book' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Book Consultation
                </Link>
                <Link href="/dashboard" className={`text-sm hover:text-primary transition-colors ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className={`text-sm hover:text-primary transition-colors ${location.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
                    Admin
                  </Link>
                )}
                <Link href="/settings" className={`text-sm hover:text-primary transition-colors ${location === '/settings' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Settings
                </Link>
                <Button variant="ghost" onClick={() => logout()} className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:text-primary transition-colors text-muted-foreground">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button variant="default" className="text-sm rounded-none border border-primary/50">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-serif text-primary mb-2">LUXE INTERIORS</p>
          <p>&copy; {new Date().getFullYear()} Luxe Interiors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

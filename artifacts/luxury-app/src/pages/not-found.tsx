import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="font-sans text-foreground/60 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Button className="rounded-none" onClick={() => setLocation("/")}>Return Home</Button>
    </div>
  );
}

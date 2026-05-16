import React from 'react';
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const scrollTo = (href: string) => { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <footer className="bg-background pt-20 pb-8 border-t border-primary/20 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col cursor-pointer mb-6" onClick={() => scrollTo('#hero')}>
              <span className="font-serif text-3xl font-bold tracking-wider text-primary">MH</span>
              <span className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-foreground/80">Interior Design</span>
            </div>
            <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-6">Transforming spaces into timeless luxury experiences. Based in Amroha, serving clients with impeccable design and craftsmanship.</p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebookF, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-foreground mb-6 text-lg">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-foreground/60">
              {[['#about', 'About Us'], ['#portfolio', 'Portfolio'], ['#testimonials', 'Testimonials'], ['#contact', 'Contact'], ['#booking', 'Book Consultation']].map(([href, label]) => (
                <li key={href}><button onClick={() => scrollTo(href)} className="hover:text-primary transition-colors">{label}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-foreground mb-6 text-lg">Our Services</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-foreground/60">
              {['Residential Interiors', 'Commercial Interiors', 'Modular Kitchens', 'Vastu Compliance', '3D Visualization'].map((s) => (
                <li key={s}><button onClick={() => scrollTo('#services')} className="hover:text-primary transition-colors">{s}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-foreground mb-6 text-lg">Newsletter</h4>
            <p className="font-sans text-sm text-foreground/60 mb-4">Subscribe for design inspiration and updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="bg-card border border-border px-4 py-2 text-sm font-sans focus:outline-none focus:border-primary w-full text-foreground placeholder:text-foreground/40" />
              <button type="submit" className="bg-primary text-primary-foreground px-4 font-sans text-sm hover:bg-primary/90 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-foreground/50">© {new Date().getFullYear()} MH Interior Design. All rights reserved.</p>
          <div className="flex gap-6 font-sans text-xs text-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

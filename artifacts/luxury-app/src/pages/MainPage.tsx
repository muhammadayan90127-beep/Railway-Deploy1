import React from "react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ServicesSection } from "../components/ServicesSection";
import { PortfolioSection } from "../components/PortfolioSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { WhyUsSection } from "../components/WhyUsSection";
import { BookingSection } from "../components/BookingSection";
import { ContactSection } from "../components/ContactSection";
import { ChatWidget } from "../components/ChatWidget";
import { Footer } from "../components/Footer";

export const MainPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <WhyUsSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
};

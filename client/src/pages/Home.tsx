import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Function to handle scroll animations
  const handleScrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const position = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (position < windowHeight * 0.85) {
        element.classList.add('animated');
      }
    });
  };

  useEffect(() => {
    // Run on initial render
    handleScrollAnimations();
    
    // Add event listener for scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScrollAnimations);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

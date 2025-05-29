import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import AnimatedElement from './AnimatedElement';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedElement>
          <div className="bg-gradient-to-r from-card/50 to-card/80 rounded-2xl p-8 md:p-12 border border-border shadow-2xl">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Web Presence?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join the hundreds of businesses that have revolutionized their online presence with our AI-powered website creation services. Let's build something extraordinary together.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  asChild
                  size="lg" 
                  variant="secondary"
                  className="rounded-xl"
                >
                  <a href="/schedule">
                    Get Started Now
                  </a>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline"
                  className="bg-background border-border rounded-xl"
                >
                  <a href="/packages">
                    View Pricing
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedElement from '@/components/AnimatedElement';

export default function ScheduleConsultation() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedElement className="max-w-4xl mx-auto text-center mb-16" isHeader={true}>
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Let's Connect
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Schedule a Free Consultation
              </h1>
              <p className="text-xl text-muted-foreground">
                Book a time with our team to discuss your project needs and discover how our AI-powered solutions can help your business grow.
              </p>
            </AnimatedElement>

            {/* Calendly Embed Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-card border border-purple-300 rounded-2xl p-4 md:p-8 shadow-lg shadow-purple-300/20">
                {/* Replace YOUR_CALENDLY_USERNAME with your actual Calendly username */}
                <div 
                  className="calendly-inline-widget" 
                  data-url="https://calendly.com/avelipp/website-consultation"
                  style={{ minWidth: '320px', height: '950px' }}
                ></div>
              </div>
            </motion.div>
            
            {/* Information Section */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
              <h2 className="text-2xl font-bold mb-8">What Happens During Your Consultation?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-xl p-6 border border-purple-300 shadow-lg shadow-purple-300/10"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-bold mb-3 text-lg">Project Discovery</h3>
                  <p className="text-muted-foreground">
                    We'll discuss your business goals, current challenges, and vision for your digital presence.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-xl p-6 border border-purple-500 shadow-lg shadow-purple-500/20"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-bold mb-3 text-lg">Solution Design</h3>
                  <p className="text-muted-foreground">
                    Our team will recommend the best AI-powered solutions tailored to your specific needs.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card rounded-xl p-6 border border-purple-700 shadow-lg shadow-purple-700/30"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-bold mb-3 text-lg">Custom Proposal</h3>
                  <p className="text-muted-foreground">
                    You'll receive a detailed proposal with timeline, pricing, and next steps within 24 hours.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Additional Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-3xl mx-auto mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-xl font-bold mb-4">Why Choose Lab AI?</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold mb-2">🚀 AI-Powered Solutions</h4>
                    <p className="text-sm text-muted-foreground">
                      Cutting-edge technology to boost your business performance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📊 Real-Time Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive insights to make data-driven decisions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Custom Development</h4>
                    <p className="text-sm text-muted-foreground">
                      Tailored solutions designed specifically for your business
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🛠️ Ongoing Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Dedicated maintenance and support to keep you running smoothly
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
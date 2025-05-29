import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedElement from '@/components/AnimatedElement';
import { Button } from "@/components/ui/button";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedElement className="max-w-3xl mx-auto text-center mb-16" isHeader={true}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Lab AI</h1>
              <p className="text-xl text-muted-foreground">
                Pioneering the future of digital experiences through AI-driven innovation.
              </p>
            </AnimatedElement>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <AnimatedElement delay={0.2}>
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                    alt="Code development workspace" 
                    className="w-full h-auto"
                  />
                </div>
              </AnimatedElement>
              
              <AnimatedElement delay={0.4}>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-6">
                  As Arizona natives, we founded Lab AI with a vision to revolutionize website design by integrating cutting-edge AI technology with powerful analytics. Our Tempe, Arizona-based team is dedicated to helping business owners maximize their product outreach through data-driven web solutions.
                </p>
                <p className="text-muted-foreground mb-6">
                  We recognized a critical gap between traditional web development and the analytical insights businesses need to truly succeed online. Our approach combines beautiful design with actionable intelligence, giving our clients the best course of action for their digital presence.
                </p>
                <p className="text-muted-foreground">
                  Today, our tight-knit team of six passionate professionals specializes in creating websites that don't just look great but actively work to expand your business reach and convert visitors into customers.
                </p>
              </AnimatedElement>
            </div>

            <AnimatedElement delay={0.6}>
              <div className="bg-card rounded-2xl border border-border p-8 mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">Our Mission & Values</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-background p-6 rounded-xl shadow-md"
                  >
                    <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-4 border-2 border-purple-400 shadow-[0_0_15px_rgba(170,0,255,0.8)] animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cb00ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(203,0,255,1)]">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Innovation</h3>
                    <p className="text-muted-foreground">
                      We constantly push the boundaries of what's possible in web development, embracing new technologies and methodologies to deliver cutting-edge solutions.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-background p-6 rounded-xl shadow-md"
                  >
                    <div className="w-14 h-14 rounded-lg bg-green-900/20 flex items-center justify-center mb-4 border-2 border-green-400 shadow-[0_0_15px_rgba(0,255,100,0.8)] animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,255,100,1)]">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" x2="8" y1="13" y2="13"></line>
                        <line x1="16" x2="8" y1="17" y2="17"></line>
                        <line x1="10" x2="8" y1="9" y2="9"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Quality</h3>
                    <p className="text-muted-foreground">
                      We're committed to excellence in every aspect of our work, from design and development to customer service and ongoing support.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-background p-6 rounded-xl shadow-md"
                  >
                    <div className="w-14 h-14 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 border-2 border-blue-400 shadow-[0_0_15px_rgba(0,100,255,0.8)] animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0064ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,100,255,1)]">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Client Focus</h3>
                    <p className="text-muted-foreground">
                      We prioritize understanding our clients' unique needs and goals, tailoring our solutions to deliver measurable results and exceptional value.
                    </p>
                  </motion.div>
                </div>
              </div>
            </AnimatedElement>


          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
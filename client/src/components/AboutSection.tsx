import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import AnimatedElement from './AnimatedElement';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/20 relative">
      <div className="container mx-auto px-4">
        <AnimatedElement className="max-w-xl mx-auto text-center mb-16" isHeader={true}>
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Lab AI
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Redefining Website Creation with AI Innovation
          </h2>
          <p className="text-muted-foreground">
            We're pioneering the future of web development by combining artificial intelligence with expert design principles to create websites that truly stand out.
          </p>
        </AnimatedElement>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedElement className="relative">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-border relative z-10 h-64 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"
            >
              <div className="relative w-full h-full p-6">
                {/* Code Editor Window */}
                <div className="bg-slate-800 rounded-lg h-full border border-slate-600 overflow-hidden">
                  {/* Window Header */}
                  <div className="bg-slate-700 px-4 py-2 flex items-center space-x-2 border-b border-slate-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-400 ml-4">lab-ai-website.tsx</div>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-4 text-xs font-mono space-y-1 text-slate-300">
                    <div className="text-blue-400">import React from 'react';</div>
                    <div className="text-purple-400">import {'{ LabAI }'} from './lab-ai';</div>
                    <div className="text-gray-500">// AI-powered website generation</div>
                    <div className="text-green-400">const website = LabAI.generate({'{'}</div>
                    <div className="text-yellow-400 ml-4">design: 'modern',</div>
                    <div className="text-yellow-400 ml-4">features: ['responsive', 'seo'],</div>
                    <div className="text-yellow-400 ml-4">analytics: true</div>
                    <div className="text-green-400">{'});'}</div>
                    <div className="text-cyan-400">export default website;</div>
                    
                    {/* Cursor */}
                    <div className="inline-block w-1 h-3 bg-white animate-pulse ml-1"></div>
                  </div>
                  
                  {/* Terminal Window */}
                  <div className="absolute bottom-2 right-2 bg-black/80 rounded border border-green-500/30 p-2 text-xs">
                    <div className="text-green-400 font-mono">$ npm run build</div>
                    <div className="text-green-300 font-mono text-xs">✓ Build complete</div>
                  </div>
                </div>
                
                {/* Floating Code Elements */}
                <div className="absolute -top-2 -right-2 bg-blue-500/20 rounded p-1 text-xs text-blue-400 font-mono">
                  {`</>`}
                </div>
                <div className="absolute -bottom-2 -left-2 bg-purple-500/20 rounded p-1 text-xs text-purple-400 font-mono">
                  AI
                </div>
              </div>
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          </AnimatedElement>
          
          <AnimatedElement className="space-y-6">
            <h3 className="text-2xl font-bold">Our Story</h3>
            <p className="text-muted-foreground">
              Lab AI was founded with a bold vision: to democratize access to cutting-edge web design and development through the power of artificial intelligence. We believe that exceptional websites should be accessible to everyone, regardless of technical skill.
            </p>
            
            <div className="space-y-4 my-8">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-purple-400 shadow-[0_0_15px_rgba(170,0,255,0.8)] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cb00ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(203,0,255,1)]">
                    <path d="M12 17.8a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path>
                    <path d="m9.8 19.8-1.6 1.6c-.5.5-1.2.8-2 .8a2.8 2.8 0 0 1-2.8-2.8c0-.8.3-1.5.8-2l1.6-1.6"></path>
                    <path d="m14.2 19.8 1.6 1.6c.5.5 1.2.8 2 .8a2.8 2.8 0 0 0 2.8-2.8c0-.8-.3-1.5-.8-2l-1.6-1.6"></path>
                    <path d="m9.8 4.2-1.6-1.6c-.5-.5-1.2-.8-2-.8a2.8 2.8 0 0 0-2.8 2.8c0 .8.3 1.5.8 2l1.6 1.6"></path>
                    <path d="m14.2 4.2 1.6-1.6c.5-.5 1.2-.8 2-.8a2.8 2.8 0 0 1 2.8 2.8c0 .8-.3 1.5-.8 2l-1.6 1.6"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">AI-Powered Design Intelligence</h4>
                  <p className="text-muted-foreground">Our proprietary AI algorithms analyze thousands of design patterns to create visually stunning and functionally superior websites.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-green-400 shadow-[0_0_15px_rgba(0,255,100,0.8)] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,255,100,1)]">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Lightning-Fast Development</h4>
                  <p className="text-muted-foreground">What typically takes weeks, we accomplish in days or even hours, without compromising on quality or customization.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-blue-400 shadow-[0_0_15px_rgba(0,100,255,0.8)] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0064ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,100,255,1)]">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Continuous Optimization</h4>
                  <p className="text-muted-foreground">Our websites learn and evolve based on user behavior and performance data, ensuring optimal conversion rates and user experience.</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild variant="default" size="lg">
                <a href="#services">Our Services</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}

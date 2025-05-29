import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import AnimatedElement from './AnimatedElement';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/50 rounded-full filter blur-[100px]"
          style={{ animationDuration: '4s' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/50 rounded-full filter blur-[100px]"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/50 rounded-full filter blur-[100px]"
          style={{ animationDuration: '4s', animationDelay: '2s' }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMTQxNTkiIGQ9Ik0zNiAxOGgtNnYxMmgzdi0zaDF2LTNoMnYtNnptLTR2MTBoLTF2MmgtMnYtMTJoM3YweiIvPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedElement className="max-w-xl" isHeader={true}>
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-semibold"
              >
                Arizona's Premier AI-Powered Web Design
              </motion.span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Analytics-Driven <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Websites</span> That Boost Product Outreach
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Based in Tempe, Arizona, Lab AI revolutionizes website design by integrating powerful analytics with cutting-edge AI. We help business owners maximize their product outreach with data-driven web solutions that convert visitors into customers.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white rounded-xl relative overflow-hidden group"
              >
                <a href="/packages">
                  <span className="relative z-10">Buy Now</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border border-border text-white hover:bg-white/10 rounded-xl"
              >
                <a href="/portfolio">
                  View Our Work
                </a>
              </Button>
            </motion.div>
          </AnimatedElement>
          
          <div className="relative hidden md:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -left-10 -top-10 w-20 h-20 bg-primary rounded-2xl opacity-20"
              style={{ animationDuration: '8s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.2, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute -right-16 -bottom-10 w-32 h-32 bg-secondary rounded-full opacity-20"
              style={{ animationDuration: '6s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }}
            />
            
            {/* Analytics Dashboard */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative z-10 transform perspective-1000"
              style={{ transform: 'perspective(1000px) rotateY(3deg) rotateX(3deg)' }}
            >
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5 }}
                className="bg-black/80 p-4 rounded-xl shadow-2xl border border-primary/30 transform hover:-translate-y-2 duration-500 w-[450px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="h-6 px-3 py-1 bg-purple-900/50 rounded-md text-xs text-purple-300 font-mono flex items-center">
                    AI Analytics Dashboard
                  </div>
                  <div className="w-6 h-6"></div>
                </div>

                {/* Analytics Dashboard Content */}
                <div className="flex flex-col gap-3">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/40 p-3 rounded-lg border border-purple-900/50">
                      <div className="text-xs text-gray-400 mb-1">User Engagement</div>
                      <div className="text-xl font-bold text-white mb-1">89.6%</div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs text-green-500">+5.2%</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-blue-900/50">
                      <div className="text-xs text-gray-400 mb-1">Conversion Rate</div>
                      <div className="text-xl font-bold text-white mb-1">7.2%</div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs text-green-500">+2.1%</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-green-900/50">
                      <div className="text-xs text-gray-400 mb-1">Product Reach</div>
                      <div className="text-xl font-bold text-white mb-1">12.4K</div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs text-green-500">+8.5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Graph Area */}
                  <div className="bg-black/40 p-4 rounded-lg border border-purple-900/50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-gray-300 font-medium">Product Outreach Analytics</div>
                      <div className="flex space-x-2">
                        <div className="px-2 py-1 bg-purple-900/50 rounded text-xs text-purple-300">Daily</div>
                        <div className="px-2 py-1 bg-black/30 rounded text-xs text-gray-400">Weekly</div>
                        <div className="px-2 py-1 bg-black/30 rounded text-xs text-gray-400">Monthly</div>
                      </div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="h-32 w-full relative">
                      {/* Chart Background Grid */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                        {Array(24).fill(0).map((_, i) => (
                          <div key={i} className="border-b border-r border-gray-800/50"></div>
                        ))}
                      </div>
                      
                      {/* Chart Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-full">
                        <svg viewBox="0 0 400 120" className="w-full h-full">
                          {/* Area gradient */}
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
                              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                            </linearGradient>
                          </defs>
                          
                          {/* Area */}
                          <path
                            d="M0,100 C50,80 100,90 150,40 C200,10 250,30 300,20 C350,30 400,60 400,80 L400,120 L0,120 Z"
                            fill="url(#gradient)"
                            className="opacity-40"
                          />
                          
                          {/* Line */}
                          <path
                            d="M0,100 C50,80 100,90 150,40 C200,10 250,30 300,20 C350,30 400,60 400,80"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          
                          {/* Data points */}
                          <circle cx="0" cy="100" r="3" fill="#a855f7" />
                          <circle cx="80" cy="85" r="3" fill="#a855f7" />
                          <circle cx="150" cy="40" r="4" fill="#a855f7" stroke="#000" strokeWidth="1" />
                          <circle cx="220" cy="25" r="3" fill="#a855f7" />
                          <circle cx="300" cy="20" r="4" fill="#a855f7" stroke="#000" strokeWidth="1" />
                          <circle cx="400" cy="80" r="3" fill="#a855f7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Chart Labels */}
                    <div className="grid grid-cols-7 mt-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={i} className="text-[10px] text-gray-500 text-center">{day}</div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights Row */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gradient-to-r from-purple-900/30 to-black/40 p-3 rounded-lg border border-purple-800/30">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">AI</span>
                          </div>
                          <div className="text-sm text-purple-300">AI Insight</div>
                        </div>
                        <div className="text-xs text-gray-400">Just now</div>
                      </div>
                      <div className="pl-8 pt-2">
                        <div className="text-gray-300 text-xs">Product "Business Analytics Suite" has 32% higher engagement than average. Consider increasing marketing focus.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

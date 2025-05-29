import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

const portfolioItems = [
  {
    id: 1,
    name: "TechFlow Solutions",
    category: "Tech Startup",
    description: "AI-powered workflow automation platform for small businesses",
    image: "/api/placeholder/400/300",
    tags: ["React", "AI Integration", "Analytics"],
    metrics: {
      traffic: "+340%",
      conversion: "12.5%",
      users: "2.3K"
    },
    year: "2024"
  },
  {
    id: 2,
    name: "GreenLeaf Organics",
    category: "E-commerce",
    description: "Sustainable organic food delivery marketplace",
    image: "/api/placeholder/400/300",
    tags: ["E-commerce", "Mobile-First", "SEO"],
    metrics: {
      traffic: "+520%",
      conversion: "8.7%",
      users: "5.1K"
    },
    year: "2024"
  },
  {
    id: 3,
    name: "UrbanFit Studios",
    category: "Fitness",
    description: "Boutique fitness studio with online class booking",
    image: "/api/placeholder/400/300",
    tags: ["Booking System", "Analytics", "Mobile App"],
    metrics: {
      traffic: "+280%",
      conversion: "15.2%",
      users: "1.8K"
    },
    year: "2024"
  },
  {
    id: 4,
    name: "Artisan Craft Co.",
    category: "Retail",
    description: "Handmade crafts and artisan goods online store",
    image: "/api/placeholder/400/300",
    tags: ["Custom Design", "Inventory", "Payment"],
    metrics: {
      traffic: "+410%",
      conversion: "9.3%",
      users: "3.2K"
    },
    year: "2023"
  },
  {
    id: 5,
    name: "MindSpace Therapy",
    category: "Healthcare",
    description: "Mental health practice with online appointment booking",
    image: "/api/placeholder/400/300",
    tags: ["HIPAA Compliant", "Scheduling", "Secure"],
    metrics: {
      traffic: "+190%",
      conversion: "22.1%",
      users: "950"
    },
    year: "2024"
  },
  {
    id: 6,
    name: "LocalEats Delivery",
    category: "Food & Beverage",
    description: "Local restaurant delivery platform and ordering system",
    image: "/api/placeholder/400/300",
    tags: ["Multi-vendor", "Real-time", "GPS"],
    metrics: {
      traffic: "+680%",
      conversion: "18.4%",
      users: "7.5K"
    },
    year: "2023"
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              Our Work
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Success Stories &{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Client Results
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover how we've helped startups and small businesses transform their digital presence with AI-powered websites and comprehensive analytics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                      {/* Mock Website Preview */}
                      <div className="w-full h-full bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
                        {/* Mock Browser Bar */}
                        <div className="bg-gray-200 px-2 py-1.5 flex items-center space-x-1 border-b border-gray-300">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 mx-2">
                            <div className="bg-white rounded px-2 py-0.5 border border-gray-300">
                              <div className="text-xs text-gray-500">{item.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Completely Different Layouts for Each Business */}
                        <div className="flex-1 bg-white relative overflow-hidden">
                          {item.id === 1 && ( // TechFlow Solutions - Dark Tech Dashboard
                            <div className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden" style={{fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'}}>
                              {/* Tech Header */}
                              <div className="bg-slate-800/80 backdrop-blur-sm border-b border-cyan-500/50 p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 transform rotate-45"></div>
                                    <span className="text-xs font-bold text-cyan-300 tracking-widest uppercase">TechFlow AI</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400 font-mono">LIVE</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Hero with Code Animation */}
                              <div className="p-3 relative">
                                <div className="text-xs font-bold text-cyan-300 mb-2 tracking-wide">AI WORKFLOW AUTOMATION PLATFORM</div>
                                
                                {/* Simulated Code Terminal */}
                                <div className="bg-black/70 rounded-none border-l-4 border-cyan-400 p-2 mb-2">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <div className="w-1 h-1 bg-green-400"></div>
                                    <div className="w-1 h-1 bg-yellow-400"></div>
                                    <div className="w-1 h-1 bg-red-400"></div>
                                  </div>
                                  <div className="space-y-0.5 text-xs font-mono">
                                    <div className="text-green-400">$ npm install @techflow/ai</div>
                                    <div className="text-cyan-300">[✓] AI modules loaded</div>
                                    <div className="text-blue-300">[✓] Workflow optimized</div>
                                  </div>
                                </div>
                                
                                {/* Dashboard Cards - Angular Design */}
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="bg-blue-500/20 border-l-2 border-blue-400 p-1 transform skew-x-3">
                                    <div className="text-xs text-blue-300 font-mono">API_CALLS</div>
                                    <div className="text-xs font-bold text-white">2.4M</div>
                                  </div>
                                  <div className="bg-purple-500/20 border-l-2 border-purple-400 p-1 transform skew-x-3">
                                    <div className="text-xs text-purple-300 font-mono">TASKS</div>
                                    <div className="text-xs font-bold text-white">45K</div>
                                  </div>
                                  <div className="bg-cyan-500/20 border-l-2 border-cyan-400 p-1 transform skew-x-3">
                                    <div className="text-xs text-cyan-300 font-mono">UPTIME</div>
                                    <div className="text-xs font-bold text-white">99.9%</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Floating Elements */}
                              <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 transform rotate-45 animate-pulse"></div>
                              <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 transform rotate-45"></div>
                            </div>
                          )}
                          
                          {item.id === 2 && ( // GreenLeaf Organics - Bright E-commerce Store
                            <div className="h-full bg-gradient-to-b from-green-50 to-emerald-50 overflow-hidden" style={{fontFamily: 'Georgia, serif'}}>
                              {/* Clean Header */}
                              <div className="bg-white shadow-sm border-b-4 border-green-300 p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-lg">🌱</div>
                                    <span className="text-sm font-bold text-green-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>GreenLeaf Organics</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="bg-green-100 rounded-full px-2 py-1 text-xs text-green-700 border-2 border-green-300">🛒 3</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Hero with Large Image */}
                              <div className="relative p-3">
                                {/* Simulated Hero Image - Curved Design */}
                                <div className="bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 rounded-3xl p-4 mb-2 relative overflow-hidden border-4 border-green-400/30">
                                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-3xl"></div>
                                  <div className="relative z-10">
                                    <div className="text-sm font-bold text-green-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>Fresh Spring Sale!</div>
                                    <div className="text-xs text-green-800 mb-2" style={{fontStyle: 'italic'}}>30% off organic vegetables</div>
                                    <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full inline-block shadow-lg">Shop Sale</div>
                                  </div>
                                  {/* Decorative vegetables */}
                                  <div className="absolute top-1 right-2 text-2xl opacity-40 transform rotate-12">🥬</div>
                                  <div className="absolute bottom-2 right-4 text-lg opacity-50 transform -rotate-12">🥕</div>
                                </div>
                                
                                {/* Product Grid - Rounded Design */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-green-200">
                                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-2 mb-1 text-center">
                                      <div className="text-lg">🥗</div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-800" style={{fontFamily: 'Georgia, serif'}}>Organic Salad Mix</div>
                                    <div className="text-xs text-green-600 font-bold">$4.99</div>
                                  </div>
                                  <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-orange-200">
                                    <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-2 mb-1 text-center">
                                      <div className="text-lg">🥕</div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-800" style={{fontFamily: 'Georgia, serif'}}>Baby Carrots</div>
                                    <div className="text-xs text-orange-600 font-bold">$3.49</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Trust Badges - Pill Shaped */}
                              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full shadow-lg">🌿 Organic</div>
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full shadow-lg">🚚 Free Ship</div>
                              </div>
                            </div>
                          )}
                          
                          {item.id === 3 && ( // UrbanFit Studios - Bold Athletic Design
                            <div className="h-full bg-gradient-to-br from-orange-900 via-red-800 to-orange-900 text-white overflow-hidden relative" style={{fontFamily: 'Impact, "Arial Black", sans-serif'}}>
                              {/* Energetic Header */}
                              <div className="bg-black/40 backdrop-blur-sm p-2 border-b-2 border-orange-500 transform -skew-x-6">
                                <div className="flex items-center justify-between transform skew-x-6">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-lg transform rotate-12">🔥</div>
                                    <span className="text-sm font-black text-orange-300 tracking-wider uppercase">UrbanFit Studios</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-red-400 font-black">LIVE CLASS</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Dynamic Class Schedule */}
                              <div className="p-3 space-y-2">
                                <div className="text-xs font-black text-orange-300 mb-2 tracking-wider uppercase">BOOK YOUR CLASS</div>
                                
                                {/* Active Class - Hexagonal Design */}
                                <div className="bg-gradient-to-r from-red-600/90 to-orange-600/90 p-2 border-l-4 border-yellow-400 transform -skew-x-3">
                                  <div className="flex items-center justify-between transform skew-x-3">
                                    <div>
                                      <div className="text-sm font-black text-white tracking-wide">HIIT BOOTCAMP</div>
                                      <div className="text-xs text-orange-200">9:00 AM • STUDIO A</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-orange-300 font-bold">12/15 SPOTS</div>
                                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs px-2 py-1 transform skew-x-6 mt-1 font-black">JOIN</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Upcoming Classes */}
                                <div className="grid grid-cols-1 gap-1">
                                  <div className="bg-black/40 p-2 border-l-2 border-orange-500 transform -skew-x-2">
                                    <div className="flex justify-between items-center transform skew-x-2">
                                      <div>
                                        <div className="text-xs font-black text-white tracking-wide">YOGA FLOW</div>
                                        <div className="text-xs text-orange-300">11:30 AM</div>
                                      </div>
                                      <div className="w-6 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform skew-x-12"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Fitness Icons Animation */}
                              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                <div className="flex space-x-2 text-lg opacity-70 transform -rotate-12">
                                  <span className="animate-bounce">🏋️</span>
                                  <span className="animate-pulse">🧘</span>
                                  <span className="animate-bounce">🤸</span>
                                </div>
                                <div className="text-xs text-orange-400 font-black tracking-wider">450+ MEMBERS</div>
                              </div>
                              
                              {/* Energy Effects */}
                              <div className="absolute top-6 right-6 w-4 h-1 bg-yellow-400 transform rotate-45 animate-ping"></div>
                              <div className="absolute bottom-8 left-6 w-1 h-4 bg-red-400 transform -rotate-45 animate-pulse"></div>
                            </div>
                          )}
                          
                          {item.id === 4 && ( // Artisan Craft Co - Vintage Handmade Style
                            <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 overflow-hidden" style={{fontFamily: '"Brush Script MT", cursive'}}>
                              {/* Rustic Header */}
                              <div className="bg-gradient-to-r from-amber-300 to-orange-300 border-b-4 border-amber-600 p-2 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30"></div>
                                <div className="flex items-center justify-between relative z-10">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-lg transform -rotate-12">🎨</div>
                                    <span className="text-sm font-bold text-amber-900 transform -rotate-2" style={{fontFamily: '"Brush Script MT", cursive', fontSize: '16px'}}>Artisan Craft Co.</span>
                                  </div>
                                  <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-none transform rotate-3 shadow-lg font-bold">30% OFF</div>
                                </div>
                              </div>
                              
                              {/* Featured Product Showcase */}
                              <div className="p-3 space-y-2">
                                {/* Large Featured Item - Vintage Paper Style */}
                                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 shadow-lg border-4 border-amber-400 p-3 relative transform -rotate-1">
                                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-none transform rotate-12 shadow-md font-bold">NEW!</div>
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-br from-amber-200 to-orange-300 rounded-full p-2 w-12 h-12 flex items-center justify-center border-2 border-amber-600">
                                      <div className="text-lg">🏺</div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-bold text-amber-900" style={{fontFamily: '"Brush Script MT", cursive'}}>Hand-Thrown Pottery</div>
                                      <div className="text-xs text-amber-700" style={{fontStyle: 'italic'}}>Authentic ceramic bowls</div>
                                      <div className="text-sm font-bold text-green-700 transform rotate-1">$24.99</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Product Grid - Scattered Layout */}
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="bg-gradient-to-b from-yellow-100 to-amber-100 rounded-none p-2 text-center border-2 border-amber-300 transform rotate-1 shadow-md">
                                    <div className="text-sm mb-1 transform -rotate-3">🧶</div>
                                    <div className="text-xs font-semibold text-amber-800" style={{fontFamily: '"Brush Script MT", cursive'}}>Knit Scarves</div>
                                  </div>
                                  <div className="bg-gradient-to-b from-orange-100 to-red-100 rounded-none p-2 text-center border-2 border-orange-300 transform -rotate-2 shadow-md">
                                    <div className="text-sm mb-1 transform rotate-2">🕯️</div>
                                    <div className="text-xs font-semibold text-orange-800" style={{fontFamily: '"Brush Script MT", cursive'}}>Soy Candles</div>
                                  </div>
                                  <div className="bg-gradient-to-b from-pink-100 to-rose-100 rounded-none p-2 text-center border-2 border-pink-300 transform rotate-2 shadow-md">
                                    <div className="text-sm mb-1 transform -rotate-1">🖼️</div>
                                    <div className="text-xs font-semibold text-pink-800" style={{fontFamily: '"Brush Script MT", cursive'}}>Art Prints</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Trust Badge - Stamp Style */}
                              <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-amber-800 to-orange-800 text-white rounded-full p-2 border-4 border-amber-600 transform -rotate-1 shadow-xl">
                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center space-x-1">
                                    <span className="transform rotate-12">⭐</span>
                                    <span style={{fontFamily: '"Brush Script MT", cursive'}}>4.9/5 (500+ reviews)</span>
                                  </div>
                                  <div className="font-bold tracking-wider">HANDCRAFTED</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {item.id === 5 && ( // MindSpace Therapy - Clean Medical Design
                            <div className="h-full bg-gradient-to-b from-blue-50 via-teal-50 to-blue-50 overflow-hidden" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                              {/* Professional Header */}
                              <div className="bg-white shadow-sm border-b-2 border-teal-300 p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-sm flex items-center justify-center">
                                      <span className="text-white text-xs">🧠</span>
                                    </div>
                                    <span className="text-sm font-light text-gray-800 tracking-wide" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>MindSpace Therapy</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                                    <span className="text-xs text-green-600 font-medium tracking-wider uppercase">HIPAA Compliant</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Appointment Booking Interface */}
                              <div className="p-3 space-y-3">
                                <div className="text-center border-b border-teal-200 pb-2">
                                  <div className="text-sm font-light text-gray-800 mb-1 tracking-wide">Schedule Your Session</div>
                                  <div className="text-xs text-gray-600 uppercase tracking-wider">Licensed Mental Health Professionals</div>
                                </div>
                                
                                {/* Available Time Slots - Medical Card Style */}
                                <div className="bg-white border-l-4 border-teal-500 p-3 shadow-sm">
                                  <div className="text-xs font-medium text-teal-800 mb-2 uppercase tracking-wider">Available Today</div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-teal-50 border border-teal-100 p-2">
                                      <div>
                                        <div className="text-sm font-medium text-teal-900 tracking-wide">Dr. Sarah Chen</div>
                                        <div className="text-xs text-teal-700 uppercase tracking-wider">2:00 PM - 3:00 PM</div>
                                      </div>
                                      <div className="bg-teal-600 text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">Book</div>
                                    </div>
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-2">
                                      <div>
                                        <div className="text-sm font-medium text-blue-900 tracking-wide">Dr. Michael Ross</div>
                                        <div className="text-xs text-blue-700 uppercase tracking-wider">4:30 PM - 5:30 PM</div>
                                      </div>
                                      <div className="bg-blue-600 text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">Book</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Trust & Security Footer - Medical Badge Style */}
                              <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white p-2 border-t-4 border-white">
                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">🔒</span>
                                    <span className="uppercase tracking-wider font-light">Secure & Confidential</span>
                                  </div>
                                  <div className="font-light tracking-widest uppercase">Licensed Therapists</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {item.id === 6 && ( // LocalEats Delivery - Playful Food App
                            <div className="h-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 text-white overflow-hidden relative" style={{fontFamily: '"Comic Sans MS", "Chalkduster", cursive'}}>
                              {/* App-Style Header */}
                              <div className="bg-black/30 backdrop-blur-sm p-2 border-b-4 border-yellow-400">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-lg transform rotate-12 animate-bounce">🍕</div>
                                    <span className="text-sm font-black transform -rotate-2" style={{fontFamily: '"Comic Sans MS", cursive', textShadow: '2px 2px 0px rgba(0,0,0,0.3)'}}>LocalEats</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse border-2 border-white shadow-lg">
                                      🚚 Live Tracking
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Delivery Hero */}
                              <div className="p-3 space-y-2">
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 text-black border-4 border-yellow-400 shadow-xl transform -rotate-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <div className="text-lg font-black text-red-600 transform rotate-1" style={{fontFamily: '"Comic Sans MS", cursive'}}>Delivery in 18 mins!</div>
                                      <div className="text-sm text-gray-600" style={{fontFamily: '"Comic Sans MS", cursive'}}>Your order from Mario's Pizza</div>
                                    </div>
                                    <div className="bg-green-500 text-white p-2 rounded-full border-2 border-yellow-400 animate-bounce">
                                      <div className="text-sm">🏍️</div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-200 rounded-full h-3 mb-1 border-2 border-gray-400">
                                    <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-3 rounded-full w-3/4 shadow-inner"></div>
                                  </div>
                                  <div className="text-xs text-gray-600 transform rotate-1" style={{fontFamily: '"Comic Sans MS", cursive'}}>Driver: Alex • On the way! 🚗💨</div>
                                </div>
                                
                                {/* Restaurant Categories - Bubble Style */}
                                <div className="grid grid-cols-4 gap-1">
                                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 text-center border-2 border-white/50 transform rotate-3 shadow-lg">
                                    <div className="text-lg mb-1 animate-bounce">🍕</div>
                                    <div className="text-xs font-black" style={{fontFamily: '"Comic Sans MS", cursive'}}>Pizza</div>
                                  </div>
                                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 text-center border-2 border-white/50 transform -rotate-2 shadow-lg">
                                    <div className="text-lg mb-1 animate-pulse">🍔</div>
                                    <div className="text-xs font-black" style={{fontFamily: '"Comic Sans MS", cursive'}}>Burgers</div>
                                  </div>
                                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 text-center border-2 border-white/50 transform rotate-1 shadow-lg">
                                    <div className="text-lg mb-1 animate-bounce">🍜</div>
                                    <div className="text-xs font-black" style={{fontFamily: '"Comic Sans MS", cursive'}}>Asian</div>
                                  </div>
                                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 text-center border-2 border-white/50 transform -rotate-1 shadow-lg">
                                    <div className="text-lg mb-1 animate-pulse">🌮</div>
                                    <div className="text-xs font-black" style={{fontFamily: '"Comic Sans MS", cursive'}}>Mexican</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Floating Promo - Speech Bubble */}
                              <div className="absolute bottom-2 left-2 right-2 bg-white text-black rounded-2xl p-2 shadow-xl border-4 border-yellow-400 transform rotate-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-sm font-black text-red-600" style={{fontFamily: '"Comic Sans MS", cursive'}}>Free Delivery Weekend! 🎉</div>
                                    <div className="text-xs text-gray-600" style={{fontFamily: '"Comic Sans MS", cursive'}}>On orders over $20</div>
                                  </div>
                                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-2 rounded-full font-black shadow-lg border-2 border-yellow-400 transform -rotate-3 animate-pulse">
                                    ORDER NOW!
                                  </div>
                                </div>
                              </div>
                              
                              {/* Floating Food Icons */}
                              <div className="absolute top-4 right-4 text-2xl opacity-40 animate-bounce transform rotate-12">🍟</div>
                              <div className="absolute top-12 left-6 text-lg opacity-50 animate-pulse transform -rotate-12">🥤</div>
                              <div className="absolute bottom-12 right-6 text-lg opacity-30 animate-bounce transform rotate-45">🍰</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="text-xs">
                        {item.year}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {item.metrics.traffic}
                        </div>
                        <div className="text-xs text-muted-foreground">Traffic</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="h-3 w-3 text-blue-500 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          {item.metrics.conversion}
                        </div>
                        <div className="text-xs text-muted-foreground">Convert</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-3 w-3 text-purple-500 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-purple-600">
                          {item.metrics.users}
                        </div>
                        <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs px-2 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>


                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's create an AI-powered website that drives real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link href="/get-started">
                  Start Your Project
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
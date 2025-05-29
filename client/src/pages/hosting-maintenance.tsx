import { Link } from "wouter";
import { Clock, Code, ShoppingBag, Palette, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostingMaintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-white">Lab <span className="text-primary">AI</span></span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/packages" className="text-muted-foreground hover:text-foreground transition-colors">
                Packages
              </Link>
              <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors">
                Schedule
              </Link>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Hosting & Maintenance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Worry-free hosting with 99.9% uptime guarantee and regular maintenance to keep your website 
            secure and up-to-date. Our expert team provides fast response support and custom solutions.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
          >
            Get Hosting Quote
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Hosting & Maintenance Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fast Response Team Support */}
            <div className="border-2 border-orange-300 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-300/20 hover:shadow-orange-300/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Fast Response Team Support</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Expert team responds to issues within 30 minutes
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  24/7 technical support and emergency assistance
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Dedicated account managers for personalized service
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Priority support queue for hosting clients
                </li>
              </ul>
            </div>

            {/* Custom Code Development */}
            <div className="border-2 border-orange-500 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Custom Code Development</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Custom code tailored to your website needs
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Hand-crafted solutions for unique requirements
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Clean, optimized code that enhances performance
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Custom functionality implementation and integration
                </li>
              </ul>
            </div>

            {/* Shopify Platform Compatibility */}
            <div className="border-2 border-orange-700 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-700/40 hover:shadow-orange-700/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Shopify Platform Compatibility</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Seamless integration with Shopify stores
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  E-commerce optimization and maintenance
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Shopify app compatibility and modifications
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Store performance monitoring and improvements
                </li>
              </ul>
            </div>

            {/* Logo and Branding Customization */}
            <div className="border-2 border-orange-400 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-400/30 hover:shadow-orange-400/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Logo and Branding Customization</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Professional logo design and implementation
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Brand consistency across all website elements
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Custom graphics and visual identity creation
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Brand guideline development and application
                </li>
              </ul>
            </div>

            {/* Free Consultation Services */}
            <div className="border-2 border-orange-600 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-600/35 hover:shadow-orange-600/45 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Free Consultation Services</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Complimentary website analysis and recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  No-obligation project assessment and planning
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Expert advice on hosting and maintenance strategies
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Custom solution proposals at no initial cost
                </li>
              </ul>
            </div>

            {/* Modern Animation Implementation */}
            <div className="border-2 border-orange-800 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-800/45 hover:shadow-orange-800/55 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-700 to-orange-900 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Modern Animation Implementation</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Smooth, professional animations and transitions
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Interactive elements that enhance user experience
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Performance-optimized motion graphics
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Custom animation effects tailored to your brand
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Guarantee Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/5 to-orange-700/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">99.9% Uptime Guarantee</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
            Our hosting infrastructure is built for reliability and performance. We monitor your website 
            24/7 and guarantee 99.9% uptime with fast response times and proactive maintenance.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-4xl font-bold text-orange-500 mb-4">30min</div>
              <h3 className="text-xl font-bold mb-4">Response Time</h3>
              <p className="text-muted-foreground">
                Expert team responds to critical issues within 30 minutes
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-4xl font-bold text-orange-500 mb-4">99.9%</div>
              <h3 className="text-xl font-bold mb-4">Uptime Guarantee</h3>
              <p className="text-muted-foreground">
                Reliable hosting infrastructure with guaranteed uptime
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-4xl font-bold text-orange-500 mb-4">24/7</div>
              <h3 className="text-xl font-bold mb-4">Support Available</h3>
              <p className="text-muted-foreground">
                Round-the-clock technical support and monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready for Worry-Free Hosting?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get reliable hosting with expert maintenance and support that keeps your website running smoothly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
              >
                Schedule Free Consultation
              </Button>
            </Link>
            <Link href="/packages">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-lg px-8 py-6"
              >
                View Hosting Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
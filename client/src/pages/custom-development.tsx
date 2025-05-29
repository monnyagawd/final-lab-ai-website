import { Link } from "wouter";
import { ShoppingCart, Database, Smartphone, Search, Users, Shield, Clock, DollarSign, BarChart, Plug, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomDevelopment() {
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
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="16" height="10" x="4" y="4" rx="1"></rect>
              <rect width="12" height="6" x="6" y="6" rx="0" fill="currentColor" opacity="0.3"></rect>
              <rect width="8" height="2" x="8" y="16" rx="1"></rect>
              <rect width="4" height="3" x="10" y="18" rx="1"></rect>
              <line x1="7" x2="9" y1="8" y2="8"></line>
              <line x1="7" x2="11" y1="10" y2="10"></line>
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Custom Development Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From complex e-commerce solutions to interactive web applications, our team delivers 
            high-performance custom websites tailored to your unique business requirements.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
          >
            Get Custom Quote
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Comprehensive Development Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* E-commerce Solutions */}
            <div className="border-2 border-blue-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">E-commerce Solutions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom shopping cart development</li>
                <li>• Payment gateway integration</li>
                <li>• Inventory management systems</li>
                <li>• Complete platform optimization</li>
              </ul>
            </div>



            {/* Database Design */}
            <div className="border-2 border-purple-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-purple-400/20 hover:shadow-purple-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4">
                <HardDrive className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Database Design</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom database schemas</li>
                <li>• Professional data migration</li>
                <li>• Scalable data architecture</li>
                <li>• Optimized performance & security</li>
              </ul>
            </div>

            {/* User Experience Design */}
            <div className="border-2 border-orange-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">User Experience Design</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom user interface design</li>
                <li>• Professional wireframing & prototyping</li>
                <li>• User journey mapping</li>
                <li>• Conversion-focused strategies</li>
              </ul>
            </div>

            {/* Mobile Responsiveness */}
            <div className="border-2 border-pink-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-pink-400/20 hover:shadow-pink-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center mb-4">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Mobile Responsiveness</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Responsive design implementation</li>
                <li>• Mobile-first development</li>
                <li>• Cross-platform compatibility</li>
                <li>• Optimized mobile experience</li>
              </ul>
            </div>

            {/* Maintenance & Support */}
            <div className="border-2 border-cyan-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Maintenance & Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ongoing technical support</li>
                <li>• Regular updates & security patches</li>
                <li>• Bug fixes & optimization</li>
                <li>• Dedicated support team</li>
              </ul>
            </div>

            {/* Timeline & Project Phases */}
            <div className="border-2 border-yellow-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Timeline & Project Phases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Detailed project roadmap</li>
                <li>• Structured development phases</li>
                <li>• Regular progress updates</li>
                <li>• Transparent project management</li>
              </ul>
            </div>

            {/* Pricing Structure */}
            <div className="border-2 border-red-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-red-400/20 hover:shadow-red-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Pricing Structure</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom quote process</li>
                <li>• Detailed project estimation</li>
                <li>• Different service tier options</li>
                <li>• Flexible payment plans</li>
              </ul>
            </div>

            {/* SEO & Analytics Integration */}
            <div className="border-2 border-indigo-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-indigo-400/20 hover:shadow-indigo-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">SEO & Analytics Integration</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Search engine optimization</li>
                <li>• Performance tracking setup</li>
                <li>• Conversion optimization</li>
                <li>• Data-driven insights</li>
              </ul>
            </div>

            {/* Third-Party Integrations */}
            <div className="border-2 border-teal-400 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-lg shadow-teal-400/20 hover:shadow-teal-400/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mb-4">
                <Plug className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Third-Party Integrations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Social media platform connections</li>
                <li>• Email marketing & CRM integration</li>
                <li>• Automated workflow implementation</li>
                <li>• Custom API development</li>
              </ul>
            </div>


          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Development Process</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
            We follow a structured, transparent development methodology that ensures your project 
            is delivered on time, within budget, and exceeds your expectations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-3xl font-bold text-primary mb-4">01</div>
              <h3 className="text-xl font-bold mb-4">Discovery & Planning</h3>
              <p className="text-muted-foreground">
                Comprehensive analysis of your requirements and detailed project roadmap creation
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-3xl font-bold text-primary mb-4">02</div>
              <h3 className="text-xl font-bold mb-4">Development & Testing</h3>
              <p className="text-muted-foreground">
                Agile development process with regular testing and quality assurance checkpoints
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <div className="text-3xl font-bold text-primary mb-4">03</div>
              <h3 className="text-xl font-bold mb-4">Launch & Support</h3>
              <p className="text-muted-foreground">
                Seamless deployment with ongoing maintenance and dedicated technical support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Build Your Custom Solution?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and create a custom development solution that drives results.
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
                className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-6"
              >
                View Development Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
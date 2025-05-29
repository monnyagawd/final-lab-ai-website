import { Link } from "wouter";
import { Bot, MessageSquare, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIPoweredDesign() {
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
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            AI-Powered Design Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Harness the power of advanced artificial intelligence to create intelligent customer service solutions, 
            custom chatbots, and seamless platform integrations that work around the clock.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
          >
            Start Your AI Integration
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our AI Integration Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Customer Service Bot Generation */}
            <div className="border-2 border-purple-400 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-purple-400/20 hover:shadow-purple-400/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Customer Service Bot Generation</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Custom customer service chatbots for websites
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Automated customer inquiry handling and support
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Professional, responsive 24/7 customer service
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Advanced AI technology for intelligent conversations
                </li>
              </ul>
            </div>

            {/* Chatbot Customization Features */}
            <div className="border-2 border-purple-600 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Chatbot Customization Features</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Customize bot colors to match your brand
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Set custom bot names that fit your company
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Create personalized greeting phrases
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Tailor the bot's personality and responses
                </li>
              </ul>
            </div>

            {/* Platform Integration Services */}
            <div className="border-2 border-purple-800 rounded-2xl p-8 bg-card/50 backdrop-blur-sm shadow-lg shadow-purple-800/40 hover:shadow-purple-800/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Platform Integration Services</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Discord bot integration for server management
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Twitter integration for autonomous posting
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Seamless integration into existing platforms
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Cross-platform compatibility and management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Advanced AI Technology</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
            Our AI integration services leverage cutting-edge artificial intelligence technology to deliver 
            intelligent, responsive, and highly customizable solutions that enhance your customer experience 
            and streamline your business operations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <h3 className="text-xl font-bold mb-4 text-primary">Intelligent Conversations</h3>
              <p className="text-muted-foreground">
                Natural language processing enables your bots to understand context and provide meaningful responses
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card/30">
              <h3 className="text-xl font-bold mb-4 text-primary">Complete Customization</h3>
              <p className="text-muted-foreground">
                Every aspect of your AI solution can be tailored to match your brand and business requirements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Integrate AI Into Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your customer service and platform management with our advanced AI integration services.
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
                View Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
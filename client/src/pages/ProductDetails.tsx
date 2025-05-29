import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedElement from '@/components/AnimatedElement';
import { useToast } from '@/hooks/use-toast';

// Define product data structure
interface ProductFeature {
  title: string;
  description: string;
}

interface PricingOption {
  price: string;
  label: string;
  value: string;
}

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  price: string;
  priceSubtext: string;
  features: string[];
  detailedFeatures: ProductFeature[];
  faqs: { question: string; answer: string }[];
  borderColor: string;
  bgColor: string;
  popular?: boolean;
  pricingOptions: PricingOption[];
}

// This could come from an API or database in a real application
const productData: Record<string, ProductDetail> = {
  "starter": {
    id: "starter",
    name: "Starter Site",
    category: "Website Builds",
    headline: "Perfect for businesses just getting started online",
    description: "A simple but effective website with all the essential features you need.",
    price: "$750-$1,000",
    priceSubtext: "one-time payment",
    pricingOptions: [
      { price: "$750", label: "Basic Starter Package", value: "starter-750" },
      { price: "$1,000", label: "Enhanced Starter Package", value: "starter-1000" }
    ],
    features: [
      "5 Custom Designed Pages",
      "Mobile Responsive Layout",
      "Contact Form",
      "Basic SEO Setup",
      "Social Media Integration"
    ],
    detailedFeatures: [
      {
        title: "5 Custom Designed Pages",
        description: "We'll create five professionally designed pages tailored to your business needs, including Home, About, Services, Contact, and one additional page of your choice."
      },
      {
        title: "Mobile Responsive Layout",
        description: "Your website will automatically adjust to look perfect on any device - from desktops to tablets and smartphones."
      },
      {
        title: "Contact Form",
        description: "A professionally designed contact form that sends inquiries directly to your email, making it easy for potential customers to reach you."
      },
      {
        title: "Basic SEO Setup",
        description: "We'll implement essential search engine optimization elements including meta tags, descriptions, and proper heading structure to help you get found online."
      },
      {
        title: "Social Media Integration",
        description: "Connect your website to your social media profiles with eye-catching icons and links to create a cohesive online presence."
      }
    ],
    faqs: [
      {
        question: "How long does it take to build a Starter Site?",
        answer: "Typically, we can complete a Starter Site within 2-3 days, depending on how quickly you provide content and feedback."
      },
      {
        question: "How do I request changes?",
        answer: "You can request changes in several ways: 1) Subscribe to one of our monthly maintenance packages which include regular updates and changes, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner to schedule a consultation for specific changes. Our monthly packages are the most cost-effective way to manage ongoing changes and improvements."
      },
      {
        question: "Do I need to provide my own hosting?",
        answer: "No, our monthly maintenance plans include hosting. We recommend pairing your Starter Site with at least our Basic Maintenance plan. Check out our maintenance options on our packages page for more information."
      }
    ],
    borderColor: "border-blue-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  "growth": {
    id: "growth",
    name: "Growth Site",
    category: "Website Builds",
    headline: "Designed for businesses ready to expand their online presence",
    description: "More pages, features, and customization for growing businesses.",
    price: "$1,500-$2,000",
    priceSubtext: "one-time payment",
    pricingOptions: [
      { price: "$1,500", label: "Basic Growth Package", value: "growth-1500" },
      { price: "$1,750", label: "Standard Growth Package", value: "growth-1750" },
      { price: "$2,000", label: "Enhanced Growth Package", value: "growth-2000" }
    ],
    features: [
      "10 Custom Designed Pages",
      "Enhanced UX Design",
      "Blog or News Section",
      "Advanced SEO Package",
      "Email Newsletter Integration",
      "Customer Testimonial System"
    ],
    detailedFeatures: [
      {
        title: "10 Custom Designed Pages",
        description: "Twice the content of our Starter package, giving you plenty of room to showcase your products, services, team members, and more."
      },
      {
        title: "Enhanced UX Design",
        description: "Advanced user experience design with interactive elements, smooth animations, and intuitive navigation to keep visitors engaged."
      },
      {
        title: "Blog or News Section",
        description: "A fully functional blog or news section with categories, archives, and a content management system that makes updates easy."
      },
      {
        title: "Advanced SEO Package",
        description: "Comprehensive search engine optimization including keyword research, content optimization, schema markup, and Google Analytics integration."
      },
      {
        title: "Email Newsletter Integration",
        description: "Connect your website to popular email marketing platforms like Mailchimp or SendGrid to grow your subscriber list."
      },
      {
        title: "Customer Testimonial System",
        description: "A dedicated section to showcase customer reviews and testimonials, building trust with potential customers."
      }
    ],
    faqs: [
      {
        question: "What makes the Growth Site different from the Starter Site?",
        answer: "The Growth Site includes more pages, advanced features like a blog and newsletter integration, and more sophisticated design elements to help your business scale."
      },
      {
        question: "How do I request changes?",
        answer: "You can request changes in several ways: 1) Subscribe to one of our monthly maintenance packages which include regular updates and changes, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner to schedule a consultation for specific changes. Our monthly packages are the most cost-effective way to manage ongoing changes and improvements."
      },
      {
        question: "Do I need a maintenance plan?",
        answer: "While not required, we strongly recommend pairing your Growth Site with at least our Premium Maintenance plan to ensure your site remains secure, up-to-date, and performing optimally. Check out our maintenance options on our packages page for more information."
      }
    ],
    borderColor: "border-primary",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    popular: true
  },
  "pro": {
    id: "pro",
    name: "Pro Site",
    category: "Website Builds",
    headline: "Enterprise-grade website with advanced functionality",
    description: "Full-featured solution with advanced tools and integrations.",
    price: "$2,500-$4,000",
    priceSubtext: "one-time payment",
    pricingOptions: [
      { price: "$2,500", label: "Basic Pro Package", value: "pro-2500" },
      { price: "$3,250", label: "Standard Pro Package", value: "pro-3250" },
      { price: "$4,000", label: "Premium Pro Package", value: "pro-4000" }
    ],
    features: [
      "20+ Custom Designed Pages",
      "Advanced Animation Effects",
      "E-commerce Functionality",
      "Custom Database Integration",
      "User Account System",
      "Advanced Analytics Dashboard",
      "Multi-language Support"
    ],
    detailedFeatures: [
      {
        title: "20+ Custom Designed Pages",
        description: "A comprehensive website with all the pages your business needs, including specialized landing pages for different products or services."
      },
      {
        title: "Advanced Animation Effects",
        description: "Eye-catching animations and interactive elements that create a memorable user experience while highlighting your key selling points."
      },
      {
        title: "E-commerce Functionality",
        description: "A complete online store with product catalog, shopping cart, secure payment processing, and order management system."
      },
      {
        title: "Custom Database Integration",
        description: "Connect your website to internal systems or third-party services through custom API integrations and database solutions."
      },
      {
        title: "User Account System",
        description: "Allow customers to create accounts, save preferences, track orders, and access exclusive content with a secure login system."
      },
      {
        title: "Advanced Analytics Dashboard",
        description: "Comprehensive data tracking and visualization tools to monitor website performance, customer behavior, and conversion rates."
      },
      {
        title: "Multi-language Support",
        description: "Reach international audiences with multilingual content management and translation tools."
      }
    ],
    faqs: [
      {
        question: "Is the Pro Site suitable for e-commerce businesses?",
        answer: "Absolutely! The Pro Site package includes full e-commerce functionality with product management, secure payment processing, and inventory tracking."
      },
      {
        question: "How do I request changes?",
        answer: "You can request changes in several ways: 1) Subscribe to one of our monthly maintenance packages which include regular updates and changes, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner to schedule a consultation for specific changes. For Pro Site clients, we recommend our Enterprise maintenance plan for comprehensive support."
      },
      {
        question: "Do you provide training for managing the website?",
        answer: "Yes, we provide comprehensive training sessions for you and your team on how to manage all aspects of your website, from content updates to e-commerce management and analytics review. We also strongly recommend pairing with our Enterprise maintenance plan for ongoing support and professional management."
      }
    ],
    borderColor: "border-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
  },
  "basic": {
    id: "basic",
    name: "Basic Plan",
    category: "Monthly Recurring",
    headline: "Essential maintenance for your website",
    description: "Keep your site secure and up-to-date with basic maintenance.",
    price: "$49",
    priceSubtext: "per month",
    pricingOptions: [
      { price: "$49", label: "Basic Maintenance", value: "basic-49" }
    ],
    features: [
      "Secure Hosting",
      "SSL Certificate",
      "Weekly Backups",
      "Basic Security Monitoring",
      "Monthly Reports"
    ],
    detailedFeatures: [
      {
        title: "Secure Hosting",
        description: "Your website will be hosted on our high-performance servers with 99.9% uptime guarantee and rapid load times."
      },
      {
        title: "SSL Certificate",
        description: "We'll install and maintain an SSL certificate to ensure your site is secure and trusted by visitors and search engines."
      },
      {
        title: "Weekly Backups",
        description: "Your website will be automatically backed up each week, so you never have to worry about losing content or data."
      },
      {
        title: "Basic Security Monitoring",
        description: "We regularly scan your website for malware and vulnerabilities to keep your site safe from common threats."
      },
      {
        title: "Monthly Reports",
        description: "Receive a monthly report on your website's performance, including traffic statistics, uptime, and security status."
      }
    ],
    faqs: [
      {
        question: "What happens if my website goes down?",
        answer: "With our Basic Plan, we'll be notified of any downtime and work to restore your site during regular business hours. For faster response times, consider our Premium or Enterprise plans."
      },
      {
        question: "How do I request changes?",
        answer: "The Basic Plan doesn't include content updates. 1) Subscribe to one of our Premium or Enterprise maintenance packages which include regular updates, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner to schedule a consultation. View all our maintenance options on our packages page."
      },
      {
        question: "Do I need to sign a long-term contract?",
        answer: "No, all our maintenance plans are month-to-month with no long-term commitment required. You can view all our maintenance packages by clicking the button below."
      }
    ],
    borderColor: "border-blue-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  "premium": {
    id: "premium",
    name: "Premium Plan",
    category: "Monthly Recurring",
    headline: "Comprehensive maintenance with regular updates",
    description: "Enhanced security and support with content management.",
    price: "$99",
    priceSubtext: "per month",
    pricingOptions: [
      { price: "$99", label: "Premium Maintenance", value: "premium-99" }
    ],
    features: [
      "Everything in Basic Plan",
      "Daily Backups",
      "Enhanced Security Suite",
      "Performance Optimization",
      "Monthly Content Updates",
      "Priority Support",
      "Search Engine Monitoring"
    ],
    detailedFeatures: [
      {
        title: "Everything in Basic Plan",
        description: "All the features of our Basic Plan, including secure hosting, SSL certificate, and regular monitoring."
      },
      {
        title: "Daily Backups",
        description: "Your website will be backed up daily instead of weekly, ensuring minimal data loss in case of any issues."
      },
      {
        title: "Enhanced Security Suite",
        description: "Advanced security features including firewall protection, intrusion detection, and regular security audits."
      },
      {
        title: "Performance Optimization",
        description: "Regular speed and performance checks with optimizations to ensure your website loads quickly on all devices."
      },
      {
        title: "Monthly Content Updates",
        description: "Up to 1 hour of content updates per month, perfect for changing text, swapping images, or adding new information."
      },
      {
        title: "Priority Support",
        description: "Get faster response times with our priority support channel, with issues addressed within 24 hours."
      },
      {
        title: "Search Engine Monitoring",
        description: "We'll monitor your search engine rankings and make recommendations to improve your visibility."
      }
    ],
    faqs: [
      {
        question: "What kind of content updates are included?",
        answer: "We can update text, replace images, add new content to existing pages, create simple new pages, or make minor design adjustments within your monthly allowance."
      },
      {
        question: "How do I request changes?",
        answer: "With the Premium Plan, you have several options: 1) Subscribe to our monthly content update service included in your plan, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner to schedule a consultation for major changes. Your monthly content updates are tracked and managed by our team."
      },
      {
        question: "Can I roll over unused content update time?",
        answer: "Unfortunately, unused content update time doesn't roll over to the next month, but you can purchase additional update hours as needed. View all our maintenance packages by clicking the button below to find the right level of support for your website."
      }
    ],
    borderColor: "border-purple-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    popular: true
  },
  "enterprise": {
    id: "enterprise",
    name: "Enterprise Plan",
    category: "Monthly Recurring",
    headline: "Complete website management solution",
    description: "Full-service support, security, and content management.",
    price: "$199",
    priceSubtext: "per month",
    pricingOptions: [
      { price: "$199", label: "Enterprise Maintenance", value: "enterprise-199" }
    ],
    features: [
      "Everything in Premium Plan",
      "Hourly Backups",
      "Dedicated Support Manager",
      "Weekly Content Updates (4 hours)",
      "24/7 Emergency Support",
      "Monthly Strategy Call",
      "Competitor Monitoring",
      "Advanced Analytics Reporting"
    ],
    detailedFeatures: [
      {
        title: "Everything in Premium Plan",
        description: "All the features from our Premium Plan, including enhanced security, performance optimization, and search engine monitoring."
      },
      {
        title: "Hourly Backups",
        description: "Your website will be backed up every hour, providing the maximum level of data protection."
      },
      {
        title: "Dedicated Support Manager",
        description: "You'll have a dedicated support manager who knows your business and website inside and out."
      },
      {
        title: "Weekly Content Updates (4 hours)",
        description: "Up to 4 hours of content updates per month, scheduled weekly to keep your site fresh and current."
      },
      {
        title: "24/7 Emergency Support",
        description: "Round-the-clock emergency support for critical issues, with guaranteed response times even on weekends and holidays."
      },
      {
        title: "Monthly Strategy Call",
        description: "A monthly call with our digital strategist to review your website performance and plan improvements."
      },
      {
        title: "Competitor Monitoring",
        description: "We'll keep an eye on your competitors' websites and digital strategies to help you stay ahead."
      },
      {
        title: "Advanced Analytics Reporting",
        description: "Comprehensive monthly reports with detailed analytics, user behavior insights, and actionable recommendations."
      }
    ],
    faqs: [
      {
        question: "What's the difference between content updates and site redesigns?",
        answer: "Content updates involve changing existing content or adding new content within your current design. Major design changes or new functionality would be quoted separately."
      },
      {
        question: "How do I request changes?",
        answer: "As an Enterprise client, you have priority access to our team: 1) Subscribe to our weekly content update service included in your plan, 2) Contact our support team directly through our contact information at the bottom of our home page, or 3) Use our chat assistant in the bottom right corner for urgent matters. Your weekly content updates are managed by your dedicated team."
      },
      {
        question: "Can I customize this plan for my specific needs?",
        answer: "Yes, the Enterprise Plan can be customized with additional services or adjusted allowances to perfectly match your business requirements. View all our maintenance options on our packages page and discuss customization with your dedicated manager."
      }
    ],
    borderColor: "border-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
  }
};

export default function ProductDetails() {
  const [location] = useLocation();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string>("");
  const { toast } = useToast();
  
  // Extract product ID from URL path
  useEffect(() => {
    const productId = location.split('/')[2]; // Assuming path is /product/[id]
    if (productId && productData[productId]) {
      const productInfo = productData[productId];
      setProduct(productInfo);
      
      // Set the first pricing option as default
      if (productInfo.pricingOptions && productInfo.pricingOptions.length > 0) {
        setSelectedPricing(productInfo.pricingOptions[0].value);
      }
    } else {
      // Product not found
      toast({
        title: "Product Not Found",
        description: "The product you're looking for doesn't exist.",
        variant: "destructive"
      });
    }
  }, [location, toast]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/packages">View All Packages</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-black border-b border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {product.headline}
                </p>
              </div>
              
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg p-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold mb-6">Select Your Package Option</h3>
                  
                  <RadioGroup 
                    value={selectedPricing} 
                    onValueChange={setSelectedPricing}
                    className="space-y-4"
                  >
                    {product.pricingOptions.map((option, index) => (
                      <div 
                        key={option.value} 
                        className={`border rounded-lg p-4 transition-all ${
                          selectedPricing === option.value 
                            ? 'border-primary shadow bg-primary/10' 
                            : 'border-zinc-800 hover:border-primary/50 bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xl font-bold">{option.price}</span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="text-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <a href={`/checkout?package=${product.id}&option=${selectedPricing}`}>
                      Purchase Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedElement className="text-center mb-16" isHeader={true}>
              <h2 className="text-3xl font-bold mb-4">Package Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything included in the {product.name} package to help your business succeed online.
              </p>
            </AnimatedElement>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {product.detailedFeatures.map((feature, index) => (
                <AnimatedElement key={index} delay={index * 0.1}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-zinc-950 border-t border-b border-zinc-800">
          <div className="container mx-auto px-4">
            <AnimatedElement className="text-center mb-16" isHeader={true}>
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Common questions about our {product.name} package.
              </p>
            </AnimatedElement>
            
            <div className="max-w-3xl mx-auto">
              {product.faqs.map((faq, index) => (
                <AnimatedElement key={index} delay={index * 0.1}>
                  <div className="mb-6 border border-zinc-800 bg-zinc-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-start">
                      <Info className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground pl-7">{faq.answer}</p>
                  </div>
                </AnimatedElement>
              ))}
              
              {/* Add "View All Packages" button for maintenance plans */}
              {(product.id === "basic" || product.id === "premium" || product.id === "enterprise") && (
                <div className="mt-10 text-center">
                  <Button 
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <a href="/packages">
                      View All Monthly Packages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedElement isHeader={true}>
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Take the next step toward growing your online presence with our {product.name} package.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <a href={`/checkout?package=${product.id}&option=${selectedPricing}`}>
                      Purchase Now
                    </a>
                  </Button>
                  <Button 
                    asChild
                    size="lg"
                    variant="outline"
                  >
                    <a href="/schedule">
                      Schedule a Consultation
                    </a>
                  </Button>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
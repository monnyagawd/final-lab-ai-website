import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedElement from '@/components/AnimatedElement';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

// Pricing tiers data
const pricingTiers = [
  {
    id: "starter",
    name: "Starter Site",
    description: "Template-based site for businesses just establishing their online presence.",
    price: "$750-$1,000",
    features: [
      "Template-based website design",
      "3-5 custom pages",
      "Basic branding implementation"
    ],
    popular: false,
    color: "from-purple-300 to-purple-400",
    borderColor: "border-purple-300",
    buttonVariant: "outline" as const
  },
  {
    id: "growth",
    name: "Growth Site",
    description: "Light customization with analytics dashboard for growing businesses.",
    price: "$1,500-$2,000",
    features: [
      "Light customization of design",
      "Custom layout tweaks",
      "Basic dashboard setup"
    ],
    popular: true,
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500",
    buttonVariant: "default" as const
  },
  {
    id: "pro",
    name: "Pro Custom",
    description: "Fully custom website with complex functionality and integrations.",
    price: "$2,500-$4,000+",
    features: [
      "Fully custom design from scratch",
      "Complex site structure",
      "Advanced integrations"
    ],
    popular: false,
    color: "from-purple-700 to-purple-900",
    borderColor: "border-purple-700",
    buttonVariant: "outline" as const
  }
];



export default function Packages() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedElement className="max-w-3xl mx-auto text-center mb-16" isHeader={true}>
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Packages
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transparent Pricing, Exceptional Value
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose from our carefully crafted packages or contact us for a custom solution tailored to your specific needs.
              </p>
            </AnimatedElement>
            
            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {pricingTiers.map((tier, index) => (
                <AnimatedElement key={tier.name} delay={index * 0.2} className="h-full">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className={`h-full rounded-2xl border ${tier.popular ? 'border-primary shadow-lg shadow-primary/20' : tier.borderColor} overflow-hidden`}
                  >
                    <div className={`p-6 ${tier.popular ? 'bg-primary/10' : 'bg-card'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold">{tier.name}</h3>
                        {tier.popular && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-6 h-12">{tier.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        <span className="text-muted-foreground ml-1">one-time payment</span>
                      </div>
                      <Button 
                        asChild
                        variant="outline"
                        className={`w-full rounded-lg ${tier.borderColor}`}
                        size="lg"
                      >
                        <a href={`/product/${tier.id}`}>See More</a>
                      </Button>
                    </div>
                  </motion.div>
                </AnimatedElement>
              ))}
            </div>
            
            {/* Maintenance Plans */}
            <AnimatedElement delay={0.6}>
              <div className="bg-card rounded-2xl border border-purple-300 p-8 mb-20">
                <h2 className="text-3xl font-bold mb-6 text-center">Monthly Recurring Plans</h2>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                  Hosting, dashboard access, and maintenance solutions to keep your website performing at its best.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      id: "basic",
                      name: "Core Plan",
                      price: "$99-$199/month",
                      features: [
                        "Dashboard access",
                        "Website hosting",
                        "Basic maintenance"
                      ],
                      borderColor: "border-purple-300",
                      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
                      color: "border-purple-300" // Added for backward compatibility
                    },
                    {
                      id: "premium",
                      name: "Growth Plan",
                      price: "$299/month",
                      features: [
                        "Everything in Core Plan, plus:",
                        "Integrated chatbot (5,000 messages/mo)",
                        "Light analytics dashboard"
                      ],
                      borderColor: "border-purple-500",
                      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
                      color: "border-purple-500" // Added for backward compatibility
                    },
                    {
                      id: "enterprise",
                      name: "Pro Plan",
                      price: "$499+/month",
                      features: [
                        "Everything in Growth Plan, plus:",
                        "Enhanced chatbot (10,000+ messages)",
                        "Full analytics dashboard"
                      ],
                      borderColor: "border-purple-700",
                      bgColor: "bg-gradient-to-br from-purple-200 to-purple-300",
                      color: "border-purple-700" // Added for backward compatibility
                    }
                  ].map((plan, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -10 }}
                      className={`h-full rounded-2xl border ${plan.borderColor} overflow-hidden`}
                    >
                      <div className="p-6 bg-card flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          {index === 1 && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold mb-6">{plan.price}</p>
                        <ul className="space-y-3 mb-6 flex-grow">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          asChild
                          variant="outline"
                          className={`w-full rounded-lg ${plan.borderColor} mt-auto`}
                          size="lg"
                        >
                          <a href={`/product/${plan.id}`}>See More</a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedElement>
            
            {/* Add-Ons and Optional Services */}
            <AnimatedElement delay={0.7}>
              <div className="bg-card rounded-2xl border border-purple-300 p-8 mb-20">
                <h2 className="text-3xl font-bold mb-6 text-center">Add-Ons and Optional Services</h2>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                  Customize your plan with these additional services to meet your specific needs.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Extra Chatbot Usage",
                      price: "$0.01 per message",
                      description: "Additional chatbot message capacity after monthly limits are reached",
                      icon: "💬"
                    },
                    {
                      name: "White-labeling",
                      price: "$200/month",
                      description: "Custom branding, domain, and interface personalization for your business",
                      icon: "🏷️"
                    },
                    {
                      name: "Team Dashboard Access",
                      price: "$100/month",
                      description: "Multi-user access capabilities for teams and clients",
                      icon: "👥"
                    },
                    {
                      name: "One-time Custom Website",
                      price: "$2,500+",
                      description: "For clients who prefer a single payment without monthly commitment",
                      icon: "🔧"
                    }
                  ].map((addon, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-background rounded-xl p-6 border border-purple-300 h-full flex flex-col"
                    >
                      <div className="text-4xl mb-4">{addon.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{addon.name}</h3>
                      <p className="text-xl font-bold mb-4 text-primary">{addon.price}</p>
                      <p className="text-muted-foreground mb-6 flex-grow">{addon.description}</p>
                      <Button 
                        asChild
                        variant="outline"
                        className="w-full mt-auto border-purple-300"
                      >
                        <a href="/contact">Inquire</a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedElement>
            
            {/* FAQ Section */}
            <AnimatedElement delay={0.8}>
              <div className="max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      question: "How long does it take to build a website with analytics integration?",
                      answer: "Our typical turnaround time is 2-4 weeks from project kickoff to launch. The analytics implementation is integrated throughout the development process, ensuring your site is data-ready from day one."
                    },
                    {
                      question: "How does AI help improve my website's performance?",
                      answer: "Our AI systems analyze user behavior, industry trends, and competitor data to provide actionable insights for your business. This helps optimize content, improve user experience, and increase conversion rates based on real data rather than guesswork."
                    },
                    {
                      question: "Do I own the website and analytics data after completion?",
                      answer: "Absolutely! Once the project is completed and final payment is received, you own 100% of the website, including all design elements, code, and content. You also retain full ownership of all analytics data collected through your website."
                    },
                    {
                      question: "What makes your approach different from other web design companies?",
                      answer: "As Arizona natives based in Tempe, we combine local business understanding with cutting-edge AI technology. Our unique approach integrates advanced analytics from the beginning, focusing on maximizing product outreach and providing actionable business intelligence, not just beautiful websites."
                    },
                    {
                      question: "Can I see examples of how your analytics have helped businesses?",
                      answer: "Yes! During our consultation, we'll share case studies showing how our integrated analytics approach has helped businesses increase traffic, improve conversion rates, and make data-driven decisions that lead to measurable growth."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card rounded-xl p-6 border border-purple-300"
                    >
                      <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedElement>
            
            {/* CTA Section */}
            <AnimatedElement delay={1.0}>
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Contact us today for a free consultation. We'll discuss your project requirements and recommend the best solution for your needs and budget.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
                >
                  <a href="/schedule">Schedule a Consultation</a>
                </Button>
              </div>
            </AnimatedElement>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
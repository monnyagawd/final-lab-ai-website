import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AnimatedElement from './AnimatedElement';

const serviceItems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <circle cx="13.5" cy="6.5" r="4.5"></circle>
        <path d="M7 21h13c1.1 0 2-.9 2-2v-4.58c0-1.22-.62-2.36-1.64-3.02l-3.32-2.12c-.4-.26-.87-.4-1.35-.4h-4.36"></path>
        <path d="M2 21h5v-9.67a2.01 2.01 0 0 0-.78-1.59l-2.4-1.92A2 2 0 0 1 3 6.17V4"></path>
      </svg>
    ),
    title: "AI-Powered Design",
    description: "Our AI analyzes the latest design trends and your brand to create visually stunning, unique websites that capture your essence.",
    color: "from-primary to-primary-dark",
    link: "/ai-powered-design",
    linkText: "Learn more",
    linkColor: "text-primary hover:text-primary/80"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect width="16" height="10" x="4" y="4" rx="1"></rect>
        <rect width="12" height="6" x="6" y="6" rx="0" fill="currentColor" opacity="0.3"></rect>
        <rect width="8" height="2" x="8" y="16" rx="1"></rect>
        <rect width="4" height="3" x="10" y="18" rx="1"></rect>
        <line x1="7" x2="9" y1="8" y2="8"></line>
        <line x1="7" x2="11" y1="10" y2="10"></line>
      </svg>
    ),
    title: "Custom Development",
    description: "From complex e-commerce solutions to interactive web applications, our team delivers high-performance custom websites.",
    color: "from-blue-500 to-blue-700",
    link: "/custom-development",
    linkText: "Learn more",
    linkColor: "text-blue-500 hover:text-blue-400"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect width="20" height="14" x="2" y="3" rx="2"></rect>
        <line x1="8" x2="16" y1="21" y2="21"></line>
        <line x1="12" x2="12" y1="17" y2="21"></line>
      </svg>
    ),
    title: "Hosting & Maintenance",
    description: "Worry-free hosting with 99.9% uptime guarantee and regular maintenance to keep your website secure and up-to-date.",
    color: "from-yellow-500 to-orange-600",
    link: "/hosting-maintenance",
    linkText: "Learn more",
    linkColor: "text-yellow-500 hover:text-yellow-400"
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedElement className="max-w-xl mx-auto text-center mb-16" isHeader={true}>
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Online Presence
          </h2>
          <p className="text-muted-foreground">
            Leverage our AI-powered solutions to create websites that don't just look great, but deliver exceptional results.
          </p>
        </AnimatedElement>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <AnimatedElement 
              key={index} 
              delay={index * 0.1}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="h-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Card className="h-full bg-card/80 border-border">
                  <CardHeader className="pb-0">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border">
                    <a href={service.link} className={`${service.linkColor} font-medium inline-flex items-center group`}>
                      {service.linkText}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatedElement>
          ))}
        </div>
        
        <AnimatedElement className="mt-16 text-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
          >
            <a href="#contact" className="flex items-center gap-2">
              <span>Discuss Your Project</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </Button>
        </AnimatedElement>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import AnimatedElement from './AnimatedElement';

type PortfolioCategory = 'all' | 'ecommerce' | 'corporate' | 'landing' | 'webapp';

const portfolioCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'webapp', label: 'Web Apps' }
];

const portfolioItems = [
  {
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Luxe Living",
    description: "Premium furniture e-commerce platform with 3D product visualization",
    categories: ['ecommerce'],
    tags: [
      { label: "E-commerce", color: "bg-primary/20 text-primary" },
      { label: "3D Graphics", color: "bg-secondary/20 text-secondary" }
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "FinanceFlow",
    description: "Real-time financial analytics dashboard with AI-powered insights",
    categories: ['webapp'],
    tags: [
      { label: "Web App", color: "bg-accent/20 text-accent" },
      { label: "Dashboard", color: "bg-blue-500/20 text-blue-500" }
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Nova Ventures",
    description: "Corporate website for a venture capital firm with interactive portfolio showcases",
    categories: ['corporate'],
    tags: [
      { label: "Corporate", color: "bg-pink-500/20 text-pink-500" },
      { label: "Interactive", color: "bg-purple-500/20 text-purple-500" }
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Savory Plate",
    description: "Restaurant website with online ordering system and reservation management",
    categories: ['landing', 'webapp'],
    tags: [
      { label: "Food & Beverage", color: "bg-yellow-500/20 text-yellow-500" },
      { label: "Booking System", color: "bg-orange-500/20 text-orange-500" }
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "EduSphere",
    description: "Online learning platform with interactive courses and real-time progress tracking",
    categories: ['webapp'],
    tags: [
      { label: "Education", color: "bg-green-500/20 text-green-500" },
      { label: "E-Learning", color: "bg-teal-500/20 text-teal-500" }
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1591035897819-f4bdf739f446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    title: "FitTrack",
    description: "Fitness tracking web application with personalized workout plans and nutrition guidance",
    categories: ['webapp'],
    tags: [
      { label: "Health & Fitness", color: "bg-red-500/20 text-red-500" },
      { label: "Web App", color: "bg-blue-400/20 text-blue-400" }
    ]
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  
  const filteredItems = activeCategory === 'all' 
    ? portfolioItems
    : portfolioItems.filter(item => item.categories.includes(activeCategory));

  return (
    <section id="portfolio" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <AnimatedElement className="max-w-xl mx-auto text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Showcasing Our Digital Creations
          </h2>
          <p className="text-muted-foreground">
            Browse through our portfolio of successful projects that demonstrate our expertise in creating exceptional digital experiences.
          </p>
        </AnimatedElement>
        
        <AnimatedElement className="flex justify-center mb-10 overflow-x-auto pb-4">
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
            {portfolioCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                onClick={() => setActiveCategory(category.id as PortfolioCategory)}
                className="rounded-md"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </AnimatedElement>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <AnimatedElement key={index} delay={index * 0.1}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative rounded-xl overflow-hidden shadow-lg"
              >
                <div className="aspect-w-3 aspect-h-2">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 flex flex-col justify-end"
                >
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={`text-xs py-1 px-2 ${tag.color} rounded-full`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatedElement>
          ))}
        </div>
        
        <AnimatedElement className="mt-12 text-center">
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="rounded-xl"
          >
            <a href="#" className="inline-flex items-center">
              <span>View All Projects</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </a>
          </Button>
        </AnimatedElement>
      </div>
    </section>
  );
}

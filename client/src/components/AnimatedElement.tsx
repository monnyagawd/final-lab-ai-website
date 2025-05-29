import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isHeader?: boolean;
}

export default function AnimatedElement({ 
  children, 
  className = "", 
  delay = 0,
  isHeader = false // keeping this prop for compatibility, but not using it
}: AnimatedElementProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: delay * 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={`animate-on-scroll ${className}`}
    >
      {children}
    </motion.div>
  );
}

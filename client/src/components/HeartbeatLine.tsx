import { motion, useAnimate } from 'framer-motion';
import { useEffect } from 'react';

interface HeartbeatLineProps {
  className?: string;
}

export default function HeartbeatLine({ className = "" }: HeartbeatLineProps) {
  const [scope, animate] = useAnimate();

  // This effect will run the flash animation sequence once when component mounts
  useEffect(() => {
    const flashAnimation = async () => {
      // First show a bright flash
      await animate("path", 
        { 
          filter: "drop-shadow(0 0 20px rgba(255,0,255,1))",
          strokeWidth: 5
        }, 
        { duration: 0.1 }
      );
      
      // Then animate from left to right quickly with a pulsing effect
      await animate(scope.current, 
        { 
          x: ["calc(-100% - 100px)", "calc(100% + 100px)"]
        }, 
        { 
          duration: 0.8, 
          ease: [0.5, 0.1, 0.75, 0.9], // Custom easing for a slightly elastic feel
          type: "spring",
          stiffness: 80
        }
      );
      
      // Then fade out
      await animate("path", 
        { 
          opacity: 0,
          filter: "drop-shadow(0 0 8px rgba(203,0,255,0.6))",
          scale: 0.9
        }, 
        { 
          duration: 0.2,
          ease: "easeOut" 
        }
      );
    };
    
    // Run the animation sequence
    flashAnimation();
  }, [animate, scope]);

  return (
    <div className={`w-full h-8 mt-2 ${className} overflow-hidden relative`}>
      <motion.div 
        ref={scope}
        className="absolute top-0 left-0 w-[120%]"
        initial={{ x: "calc(-100% - 100px)" }}
      >
        <svg 
          viewBox="0 0 800 50" 
          className="w-full overflow-visible"
        >
          <motion.path
            d="M0,25 L40,25 L60,10 L80,40 L100,15 L120,35 L140,15 L160,35 L180,10 L200,25 L220,25 L240,5 L260,45 L280,10 L300,40 L320,20 L340,30 L360,10 L380,25 L400,15 L420,35 L440,15 L460,35 L480,15 L500,45 L520,5 L540,25 L560,15 L580,35 L600,10 L620,40 L640,20 L660,30 L680,10 L700,25 L720,15 L740,25 L760,25 L800,25"
            fill="transparent"
            strokeWidth={4}
            stroke="rgba(203,0,255,1)"
            className="drop-shadow-[0_0_15px_rgba(203,0,255,1)]"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 1, opacity: 1 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
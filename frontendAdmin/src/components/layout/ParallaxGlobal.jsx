import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ParallaxGlobal.css';

const BikeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="40" r="12" stroke="#FF6B35" strokeWidth="3" fill="none"/>
    <circle cx="48" cy="40" r="12" stroke="#FF6B35" strokeWidth="3" fill="none"/>
    <line x1="16" y1="40" x2="32" y2="28" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
    <line x1="32" y1="28" x2="48" y2="40" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
    <line x1="28" y1="28" x2="36" y2="28" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="28" r="4" stroke="#FF6B35" strokeWidth="2" fill="none"/>
    <path d="M16 28 L20 18 L24 28" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="44" y1="32" x2="52" y2="28" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function ParallaxGlobal() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cloud1X = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const cloud2X = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const cloud3X = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  
  const mountain1X = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const mountain2X = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const mountain3X = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const mountain4X = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const mountain5X = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  
  const bikeX = useTransform(scrollYProgress, [0, 0.7], ["5%", "95%"]);
  const bikeOpacity = useTransform(scrollYProgress, [0, 0.1, 0.6, 0.7], [0, 1, 1, 0]);
  const bikeScale = useTransform(scrollYProgress, [0, 0.1, 0.6, 0.7], [0.5, 1, 1, 0.3]);

  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const roadOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="parallax-background" ref={containerRef}>
      <div className="parallax-sky" />
      
      <motion.div 
        className="parallax-sun"
        style={{ y: sunY, scale: sunScale }}
      />
      
      <motion.div className="parallax-clouds">
        <motion.div 
          className="parallax-cloud parallax-cloud-1" 
          style={{ x: cloud1X }}
        />
        <motion.div 
          className="parallax-cloud parallax-cloud-2" 
          style={{ x: cloud2X }}
        />
        <motion.div 
          className="parallax-cloud parallax-cloud-3" 
          style={{ x: cloud3X }}
        />
      </motion.div>
      
      <div className="parallax-mountains">
        <motion.div 
          className="parallax-mountain parallax-mountain-1" 
          style={{ x: mountain1X }}
        />
        <motion.div 
          className="parallax-mountain parallax-mountain-2" 
          style={{ x: mountain2X }}
        />
        <motion.div 
          className="parallax-mountain parallax-mountain-3" 
          style={{ x: mountain3X }}
        />
        <motion.div 
          className="parallax-mountain parallax-mountain-4" 
          style={{ x: mountain4X }}
        />
        <motion.div 
          className="parallax-mountain parallax-mountain-5" 
          style={{ x: mountain5X }}
        />
      </div>
      
      <motion.div 
        className="parallax-road-line"
        style={{ opacity: roadOpacity }}
      />
      
      <motion.div 
        className="parallax-bike pedal"
        style={{ 
          left: bikeX, 
          opacity: bikeOpacity,
          scale: bikeScale
        }}
      >
        <BikeIcon />
      </motion.div>
    </div>
  );
}

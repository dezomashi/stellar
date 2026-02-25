import { motion } from "framer-motion";

export default function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(to right, #4f4f4f 1px, transparent 1px), 
                            linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 30%, transparent 100%)'
        }}
      />
      <motion.div 
        animate={{ 
          y: [0, 60],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 w-full h-[200%]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,
          backgroundSize: '100% 60px',
        }}
      />
    </div>
  );
}

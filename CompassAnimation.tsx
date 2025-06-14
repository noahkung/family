import { motion } from 'framer-motion';

export function CompassAnimation() {
  return (
    <div className="relative mb-12 flex justify-center animate-float">
      <div className="w-48 h-48 mx-auto relative">
        {/* Compass Base */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-accent via-yellow-400 to-accent rounded-full shadow-2xl border-8 border-white/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Compass Rose */}
        <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
          <div className="relative">
            {/* Cardinal directions */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-primary font-bold text-xs">N</div>
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-primary font-bold text-xs">E</div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-primary font-bold text-xs">S</div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-primary font-bold text-xs">W</div>
            
            {/* Compass Needle */}
            <motion.div 
              className="w-16 h-16 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Pulse ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-accent"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

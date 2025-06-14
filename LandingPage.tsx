// client/src/pages/LandingPage.tsx

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'wouter';
import quantFamilyLogo from '@assets/QUANT-FAMILY-LOGO.png';
import familyBusinessAsiaLogo from '@assets/344686-removebg-preview.png';

export function LandingPage() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const handleStartAssessment = () => {
    setLocation('/name-input'); // <--- เปลี่ยนตรงนี้
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-6">
      {/* Main content centered */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto">
        {/* Title section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-3 gradient-text">
            {t('landing.title')}
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            {t('landing.subtitle')}
          </h2>
        </motion.div>

        {/* Compass section */}
        <motion.div
          className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Compass outer ring */}
          <div className="w-full h-full relative">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border-4 border-amber-200 shadow-2xl"></div>

            {/* Inner compass rose - slowly rotating */}
            <motion.div
              className="absolute inset-4 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {/* 8-pointed star compass rose */}
              <svg className="w-full h-full" viewBox="0 0 120 120">
                {/* Main 4 points (N, E, S, W) - longer */}
                <path d="M60 10 L63 55 L60 60 L57 55 Z" fill="#F59E0B" className="drop-shadow-sm" />
                <path d="M110 60 L65 63 L60 60 L65 57 Z" fill="#F59E0B" className="drop-shadow-sm" />
                <path d="M60 110 L57 65 L60 60 L63 65 Z" fill="#F59E0B" className="drop-shadow-sm" />
                <path d="M10 60 L55 57 L60 60 L55 63 Z" fill="#F59E0B" className="drop-shadow-sm" />

                {/* Secondary 4 points (NE, SE, SW, NW) - shorter */}
                <path d="M60 60 L85 35 L88 38 L63 63 Z" fill="#EAB308" className="drop-shadow-sm" />
                <path d="M60 60 L85 85 L82 88 L57 63 Z" fill="#EAB308" className="drop-shadow-sm" />
                <path d="M60 60 L35 85 L32 82 L57 57 Z" fill="#EAB308" className="drop-shadow-sm" />
                <path d="M60 60 L35 35 L38 32 L63 57 Z" fill="#EAB308" className="drop-shadow-sm" />

                {/* Center circle */}
                <circle cx="60" cy="60" r="4" fill="#1E40AF" />

                {/* Inner decorative ring */}
                <circle cx="60" cy="60" r="20" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Compass direction labels */}
            <div className="absolute inset-0">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-primary font-bold text-sm">N</div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary font-bold text-sm">E</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-primary font-bold text-sm">S</div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-primary font-bold text-sm">W</div>
            </div>
          </div>

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent opacity-30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Description section */}
        <motion.p
          className="text-slate-600 sm:text-base text-[16px] max-w-2xl mx-auto mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t('landing.description')}
        </motion.p>

        {/* Start button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleStartAssessment}
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('landing.startAssessment')}
          </Button>
        </motion.div>
      </div>

      {/* Footer section */}
      <div className="mt-auto">
        {/* Partner logos */}
        <motion.div
          className="flex justify-center items-center gap-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <img
            src={quantFamilyLogo}
            alt="Quant Family Office"
            className="h-32 sm:h-40 md:h-48 object-contain"
          />
          <img
            src={familyBusinessAsiaLogo}
            alt="Family Business Asia"
            className="h-20 sm:h-26 md:h-32 object-contain"
          />
        </motion.div>

        {/* Copyright and Version Info */}
        <motion.div
          className="text-center text-xs sm:text-sm text-slate-400 px-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t('landing.copyright')}
          <br />
          {t('footer.version_info')}
        </motion.div>
      </div>
    </div>
  );
}
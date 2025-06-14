// client/src/pages/NameInputPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocation } from 'wouter';

export function NameInputPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { userName, setUserName } = useAssessment(); // ดึง userName และ setUserName จาก useAssessment

  const [nameInput, setNameInput] = useState(userName || ''); // ใช้ userName จาก store เป็นค่าเริ่มต้น

  const handleContinue = () => {
    setUserName(nameInput.trim()); // บันทึกชื่อที่กรอก
    setLocation('/role-selection'); // ไปหน้าเลือกบทบาท
  };

  const handleSkip = () => {
    setUserName(''); // ล้างชื่อถ้าข้าม
    setLocation('/role-selection'); // ไปหน้าเลือกบทบาท
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-6">
      <motion.div
        className="text-center mb-8 max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
          {t('nameInput.title')}
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl mb-8">
          {t('nameInput.subtitle')}
        </p>

        <div className="space-y-4 mb-8">
          <Label htmlFor="userNameInput" className="sr-only">
            {t('nameInput.label')}
          </Label>
          <Input
            id="userNameInput"
            type="text"
            placeholder={t('nameInput.placeholder')}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full text-center text-lg py-3"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleContinue}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={!nameInput.trim()} // ถ้าไม่มีชื่อก็ disable ปุ่ม
          >
            {t('nameInput.continueButton')}
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('nameInput.skipButton')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
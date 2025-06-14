// src/pages/Assessment.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocation } from 'wouter';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessmentData';

export function Assessment() { // <--- ตรวจสอบว่ามี 'export function Assessment()' แบบนี้เป๊ะๆ
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const {
    getProgress,
    setAnswer,
    nextQuestion,
    previousQuestion,
    completeAssessment,
    answers,
    currentQuestionIndex
  } = useAssessment();

  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progress = getProgress();

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(answers[currentQuestion.id] || null);
    }
  }, [currentQuestionIndex, currentQuestion, answers]);

  if (!currentQuestion) {
    return null;
  }

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswer(answer);
    setAnswer(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (progress && progress.current >= progress.total) {
      completeAssessment();
      setLocation('/results');
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const getDimensionName = (dimension: string) => {
    const dimensionMap: Record<string, string> = {
      'governance': t('dimension.governance'),
      'legacy': t('dimension.legacy'),
      'relationships': t('dimension.relationships'),
      'strategy': t('Strategy'),
    };
    return dimensionMap[dimension] || dimension;
  };

  const questionText = language === 'en' ? currentQuestion.question.en : currentQuestion.question.th;

  const options = Object.entries(currentQuestion.options).map(([key, option]) => ({
    key: key as 'A' | 'B' | 'C' | 'D',
    text: language === 'en' ? option.text.en : option.text.th,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      {/* Progress Header */}
      <div className="pt-8 mb-6">
        <div className="text-center mb-4">
          <h3 className="sm:text-xl font-bold text-navy mb-2 text-[22px]">
            {getDimensionName(currentQuestion.dimension)}
          </h3>
          <div className="text-slate-500 text-[18px]">
            {t('assessment.progress')} {progress?.current} {t('assessment.of')} {progress?.total}
          </div>
        </div>
        <Progress value={progress?.percentage} className="h-2" />
      </div>
      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="flex-1 mb-6"
      >
        <div className="h-full flex flex-col">
          <h4 className="text-xl sm:text-2xl font-semibold text-navy mb-8 leading-relaxed text-center">
            {questionText}
          </h4>

          {/* Answer Options */}
          <div className="space-y-4 flex-1">
            {options.map(({ key, text }) => (
              <motion.label
                key={key}
                className={`block p-4 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedAnswer === key
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-primary/50 active:border-primary'
                }`}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(key)}
              >
                <input
                  type="radio"
                  name="answer"
                  value={key}
                  checked={selectedAnswer === key}
                  onChange={() => handleAnswerSelect(key)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 border-2 border-primary rounded-full mt-0.5 flex items-center justify-center flex-shrink-0 ${
                    selectedAnswer === key ? 'bg-primary' : 'bg-white'
                  }`}>
                    {selectedAnswer === key && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-navy text-lg sm:text-xl leading-relaxed">
                      {key}. {text}
                    </div>
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
        </div>
      </motion.div>
      {/* Navigation */}
      <div className="flex justify-between items-center space-x-4 text-[20px]">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="flex-1 max-w-32 py-3 font-semibold"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">{t('assessment.previous')}</span>
          <span className="sm:hidden">{t('assessment.previous')}</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 font-semibold"
        >
          <span className="hidden sm:inline">
            {progress && progress.current >= progress.total ? t('assessment.complete') : t('assessment.next')}
          </span>
          <span className="sm:hidden">
            {progress && progress.current >= progress.total ? t('assessment.complete') : t('assessment.next')}
          </span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
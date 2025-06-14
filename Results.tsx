// client/src/pages/Results.tsx

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RotateCcw, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart } from '@/components/RadarChart';
import { useLanguage } from '@/hooks/useLanguage';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import quantFamilyLogo from '@assets/QUANT-FAMILY-LOGO.png';
import familyBusinessAsiaLogo from '@assets/344686-removebg-preview.png';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessmentData';

// กำหนดคะแนนสูงสุดสำหรับแต่ละมิติและคะแนนรวม
const MAX_DIMENSION_SCORE_RESULTS = 12; // 3 คำถาม * 4 คะแนน/คำถาม
const MAX_OVERALL_SCORE_RESULTS = 48;   // 4 มิติ * 12 คะแนน/มิติ

export function Results() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // ดึง state isComplete และ hasSubmittedLocally จาก useAssessment
  const { getResults, resetAssessment, role, answers, setRole, setAnswer, setLanguage, isComplete, hasSubmittedLocally, setHasSubmittedLocally, userName, setUserName } = useAssessment();

  // ย้ายการประกาศ sharedData มาไว้ที่นี่ (ก่อน useEffect)
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get('data');
  // เก็บสถานะว่ากำลังดูจากลิงก์ที่แชร์หรือไม่
  const isViewingSharedLink = !!sharedData;

  // If we have shared data, decode and use it (results และ currentRole ถูกประกาศเป็น let ด้านบนแล้ว)
  let results = getResults();
  let currentRole = role;

  if (isViewingSharedLink) {
    try {
      const decodedData = JSON.parse(atob(sharedData!));
      results = decodedData.results;
      currentRole = decodedData.role;

      // Update the assessment store with shared data if it's empty
      if (!isComplete && Object.keys(answers).length === 0) {
        setRole(decodedData.role);
        setLanguage(decodedData.language);
        if (decodedData.userName !== undefined && decodedData.userName !== null) { // ดึง userName จาก sharedData
          setUserName(decodedData.userName);
        }
        Object.entries(decodedData.answers).forEach(([questionId, answer]) => {
          setAnswer(questionId, answer as 'A' | 'B' | 'C' | 'D');
        });
      }
    } catch (error) {
      console.error('Failed to decode shared data:', error);
      results = getResults();
    }
  }

  const submitResultsMutation = useMutation({
    mutationFn: async () => {
      const questionScores: Record<string, number> = {};

      ASSESSMENT_QUESTIONS.forEach((question, index) => {
        const answer = answers[question.id];
        if (answer) {
          questionScores[`q${index + 1}Score`] = question.options[answer].points;
        } else {
          questionScores[`q${index + 1}Score`] = 0;
        }
      });

      const submissionData = {
        role,
        // ส่ง userName ไปยัง Backend ด้วย (ต้องแน่ใจว่าเป็น null ถ้าว่าง)
        userName: userName && userName.trim() !== '' ? userName.trim() : null,
        ...questionScores,
        governanceScore: results.governance.score,
        legacyScore: results.legacy.score,
        relationshipsScore: results.relationships.score,
        strategyScore: (results as any).strategy?.score || (results as any).entrepreneurship?.score,
        overallScore: results.overall.score,
        ipAddress: null,
        userAgent: navigator.userAgent,
      };

      const response = await apiRequest('POST', '/api/assessment/submit', submissionData);
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Unknown error during submission');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: 'Assessment results saved successfully',
      });
      setHasSubmittedLocally(true);
    },
    onError: (error: any) => {
      console.error('Failed to submit results:', error);
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to save results, but you can still view them',
        variant: 'destructive',
      });
    },
  });

  // Submit results when component mounts
  useEffect(() => {
    if (!isViewingSharedLink && isComplete && Object.keys(answers).length > 0 && !hasSubmittedLocally) {
        console.log("Submitting results from local session...");
        submitResultsMutation.mutate();
    }
  }, [answers, isViewingSharedLink, isComplete, hasSubmittedLocally, userName]);


  const handleRetakeAssessment = () => {
    resetAssessment();
    setLocation('/');
  };

  const handleSaveAsPicture = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('results-content');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#f8fafc',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            const fileName = `family-business-assessment-results-${new Date().toISOString().split('T')[0]}.png`;

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
              try {
                await navigator.share({
                  title: language === 'th' ? 'ผลการประเมินธุรกิจครอบครัว' : 'Family Business Assessment Results',
                  files: [new File([blob], fileName, { type: 'image/png' })]
                });
                toast({
                  title: language === 'th' ? 'บันทึกสำเร็จ' : 'Success',
                  description: language === 'th' ? 'รูปภาพถูกบันทึกแล้ว' : 'Image saved successfully',
                });
                return;
              } catch (shareError) {
                console.error('Web Share API (file) failed:', shareError);
                triggerDownload(blob, fileName);
              }
            } else {
              triggerDownload(blob, fileName);
            }
          }
        }, 'image/png', 0.95);
      }
    } catch (error) {
      console.error('Save as picture error:', error);
      toast({
        title: language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
        description: language === 'th' ? 'ไม่สามารถบันทึกรูปภาพได้' : 'Unable to save image',
        variant: 'destructive',
      });
    }
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'th' ? 'บันทึกสำเร็จ' : 'Success',
      description: language === 'th' ? 'รูปภาพถูกดาวน์โหลดแล้ว' : 'Image downloaded successfully',
    });
  };

  const handleShare = async () => {
    const shareData = {
      role: currentRole,
      userName: userName, // ส่ง userName ไปใน sharedData ด้วย
      language,
      answers,
      results
    };

    const encodedData = btoa(JSON.stringify(shareData));
    const shareUrl = `<span class="math-inline">\{window\.location\.origin\}/results?data\=</span>{encodedData}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'th' ? 'ผลการประเมินธุรกิจครอบครัว' : 'Family Business Assessment Results',
          text: language === 'th' ? `ผลการประเมินเข็มทิศความมั่งคั่งครอบครัวของ ${userName || 'ฉัน'}` : `Check out ${userName || 'my'} Family Business Assessment results`, // ปรับข้อความแชร์ให้มีชื่อ
          url: shareUrl,
        });
      } catch (error) {
        console.error('Web Share API failed:', error);
        handleCopyToClipboard(shareUrl);
      }
    } else {
      handleCopyToClipboard(shareUrl);
    }
  };

  const handleCopyToClipboard = (urlToCopy: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(urlToCopy).then(() => {
        toast({
          title: language === 'th' ? 'คัดลอกแล้ว' : 'Copied',
          description: language === 'th' ? 'ลิงก์ถูกคัดลอกไปยังคลิปบอร์ด' : 'Link copied to clipboard',
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
          description: language === 'th' ? 'ไม่สามารถคัดลอกลิงก์ได้' : 'Unable to copy link',
          variant: 'destructive',
        });
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = urlToCopy;

      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        toast({
            title: language === 'th' ? 'คัดลอกแล้ว' : 'Copied',
            description: language === 'th' ? 'ลิงก์ถูกคัดลอกไปยังคลิปบอร์ด' : 'Link copied to clipboard',
        });
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        toast({
            title: language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
            description: language === 'th' ? 'ไม่สามารถคัดลอกลิงก์ได้' : 'Unable to copy link',
            variant: 'destructive',
        });
      }

      document.body.removeChild(textArea);
    }
  };

  // ฟังก์ชันสำหรับกำหนดระดับคะแนนตามคู่มือใหม่
const getScoreLevelLabel = (score: number, maxScore: number): 'critical' | 'needs-improvement' | 'moderate' | 'good' | 'excellent' => {
  const percentage = (score / maxScore) * 100;
  if (maxScore === MAX_OVERALL_SCORE_RESULTS) { // สำหรับคะแนนรวม
    if (percentage >= 81) return 'excellent';
    if (percentage >= 65) return 'good';
    if (percentage >= 50) return 'moderate';
    if (percentage >= 31) return 'needs-improvement';
    return 'critical';
  } else { // สำหรับคะแนนแต่ละมิติ
    if (percentage >= 83) return 'excellent';
    if (percentage >= 67) return 'good';
    if (percentage >= 50) return 'moderate';
    if (percentage >= 33) return 'needs-improvement';
    return 'critical';
  }
};

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'needs-improvement': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-100';
      case 'good': return 'bg-blue-100';
      case 'moderate': return 'bg-yellow-100';
      case 'needs-improvement': return 'bg-orange-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  // กำหนด dimensionsData ที่นี่เพื่อให้ re-render เมื่อภาษาเปลี่ยน
  const dimensionsData = [
    { key: 'governance', name: t('dimension.governance'), result: results.governance },
    { key: 'legacy', name: t('dimension.legacy'), result: results.legacy },
    { key: 'relationships', name: t('dimension.relationships'), result: results.relationships },
    { key: 'strategy', name: t('Strategy'), result: (results as any).strategy || (results as any).entrepreneurship },
  ];

  return (
    <div id="results-content" className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy mb-2 gradient-text">
          {t('results.title')}
        </h2>
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {/* แสดง Family Wealth Compass พร้อมชื่อผู้ใช้ หรือ บทบาท */}
            {t('results.family_wealth_compass')}

            {/* แสดงชื่อผู้ใช้ (userName) ถ้ามีและไม่ว่างเปล่า */}
            {userName && userName.trim() !== '' && (
              <>
                {' '} {/* เพิ่มช่องว่าง */}
                <span className="text-base sm:text-lg font-normal">({userName})</span> {/* ขนาดเล็กกว่า Family */}
              </>
            )}

            {/* แสดงบทบาท (currentRole) ถ้ามี และไม่มี userName หรือ userName เป็นค่าว่าง */}
            {currentRole && (!userName || userName.trim() === '') && (
              <>
                {' '} {/* เพิ่มช่องว่าง */}
                ({currentRole === 'founder' && (language === 'th' ? 'ผู้ก่อตั้ง' : 'Founder')}
                {currentRole === 'family-employee' && (language === 'th' ? 'สมาชิกครอบครัวที่เป็นพนักงาน' : 'Family Employee')}
                {currentRole === 'family-non-employee' && (language === 'th' ? 'สมาชิกครอบครัวที่ไม่เป็นพนักงาน' : 'Family Non-Employee')}
                {currentRole === 'external-advisor' && (language === 'th' ? 'ที่ปรึกษาภายนอก' : 'External Advisor')})
              </>
            )}
          </span>
        </div>
        <p className="text-slate-600 sm:text-base text-[16px]">
          {t('results.subtitle')}
        </p>
      </motion.div>
      <div className="flex-1 space-y-8 mb-8">
        {/* Radar Chart - Now at top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-2xl">
            {/* ส่ง dimensionsData ไปยัง RadarChart */}
            <RadarChart results={results} dimensionsData={dimensionsData} className="w-full h-96" />
          </div>
        </motion.div>

        {/* Overall Score with Percentages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-navy text-center">
                    {t('results.overallAssessment')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                      {Math.round(results.overall.percentage)}%
                    </div>
                    <div className="text-slate-600 mt-1 text-sm">
                      {results.overall.score} / {MAX_OVERALL_SCORE_RESULTS} points
                    </div>
                    <div className={`text-lg font-semibold ${getLevelColor(getScoreLevelLabel(results.overall.score, MAX_OVERALL_SCORE_RESULTS))}`}>
                      {t(`level.${getScoreLevelLabel(results.overall.score, MAX_OVERALL_SCORE_RESULTS)}`)}
                    </div>
                  </div>

                  {/* Dimension Scores */}
                  <div className="space-y-3">
                    {dimensionsData.map(({ key, name, result }) => (
                      <div key={key} className={`flex justify-between items-center p-3 ${getLevelBg(getScoreLevelLabel(result.score, MAX_DIMENSION_SCORE_RESULTS))} rounded-xl`}>
                        <div>
                          <div className="font-semibold text-navy sm:text-base text-[18px]">{name}</div>
                          <div className="text-xs text-slate-500">
                            {result.score} / {MAX_DIMENSION_SCORE_RESULTS} points
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-primary">
                            {Math.round(result.percentage)}%
                          </div>
                          <div className={`text-xs font-medium ${getLevelColor(getScoreLevelLabel(result.percentage, 100))}`}>
                            {t(`level.${getScoreLevelLabel(result.percentage, 100)}`)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dimension Descriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-navy text-center">
                    {language === 'th' ? 'คำอธิบายมิติทั้ง 4 ด้าน' : 'Four Dimensions Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {dimensionsData.map(({ key, name, result }) => (
                    <div key={key} className="border-l-4 border-primary pl-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-navy text-lg">{name}</h3>
                        <span className="text-lg font-bold text-primary">{Math.round(result.percentage)}%</span>
                      </div>
                      <p className="text-slate-600 text-[16px]">
                        {t(`dimension.${key}.description` as any)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Question Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-navy text-center">
                    {language === 'th' ? 'การวิเคราะห์รายละเอียดแต่ละหัวข้อ' : 'Detailed Topic Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {dimensionsData.map(({ key, name, result }) => {
                      const currentDimensionQuestions = ASSESSMENT_QUESTIONS.filter(q => q.dimension === key);

                      return (
                        <div key={key} className="border-l-4 border-primary pl-4">
                          <h4 className="text-navy mb-3 font-bold text-[18px]">
                            {name} ({result.score}/{MAX_DIMENSION_SCORE_RESULTS} points)
                          </h4>
                          <div className="space-y-2">
                            {currentDimensionQuestions.map((question) => {
                              const answer = answers[question.id];
                              const answerPoints = answer ? question.options[answer].points : 0;

                              const topicText = question.question[language];

                              return (
                                <div key={question.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                  <div className="flex-1">
                                    <div className="font-medium text-navy text-[16px]">
                                      {topicText}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-primary">
                                      {answerPoints}/4
                                    </div>
                                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                                      <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${(answerPoints / 4) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleSaveAsPicture}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'th' ? 'บันทึกเป็นรูปภาพ' : 'Save as Picture'}
            </Button>

            <Button
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {language === 'th' ? 'แชร์' : 'Share'}
            </Button>

            <Button
              onClick={handleRetakeAssessment}
              variant="outline"
              className="flex-1 py-3 font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('results.retakeAssessment')}
            </Button>
          </motion.div>
          {/* Partner Logos */}
          <motion.div
            className="flex justify-center items-center gap-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
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
          {/* Copyright */}
          <motion.div
            className="text-center text-xs sm:text-sm text-slate-400 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {t('landing.copyright')}
            <br />
            {t('footer.version_info')}
          </motion.div>
        </div>
      );
    }
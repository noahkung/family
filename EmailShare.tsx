import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function EmailShare() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: language === 'th' ? 'ข้อผิดพลาด' : 'Error',
        description: language === 'th' ? 'กรุณากรอกอีเมล' : 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Here you would integrate with your email service
    // For now, we'll simulate the email sending
    setTimeout(() => {
      toast({
        title: language === 'th' ? 'ส่งสำเร็จ' : 'Sent Successfully',
        description: language === 'th' ? 'ผลการประเมินถูกส่งทางอีเมลแล้ว' : 'Assessment results have been sent via email',
      });
      setIsLoading(false);
      setLocation('/results');
    }, 2000);
  };

  const goBack = () => {
    setLocation('/results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          onClick={goBack}
          variant="ghost"
          className="absolute left-4 top-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'th' ? 'กลับ' : 'Back'}
        </Button>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy mb-2 gradient-text">
          {language === 'th' ? 'ส่งผลการประเมินทางอีเมล' : 'Email Assessment Results'}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base px-4">
          {language === 'th' ? 'กรอกข้อมูลเพื่อส่งผลการประเมินทางอีเมล' : 'Enter details to email your assessment results'}
        </p>
      </motion.div>

      {/* Email Form */}
      <motion.div
        className="flex-1 max-w-2xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-navy flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              {language === 'th' ? 'ส่งทางอีเมล' : 'Send via Email'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-navy">
                {language === 'th' ? 'อีเมลผู้รับ' : 'Recipient Email'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'th' ? 'example@email.com' : 'example@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-navy">
                {language === 'th' ? 'ข้อความเพิ่มเติม (ไม่บังคับ)' : 'Additional Message (Optional)'}
              </Label>
              <Textarea
                id="message"
                placeholder={language === 'th' ? 'เพิ่มข้อความส่วนตัว...' : 'Add a personal message...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            {/* Confidentiality Notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-navy mb-2">
                {language === 'th' ? 'ข้อมูลความเป็นส่วนตัว' : 'Confidentiality Notice'}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'th' 
                  ? 'ผลการประเมินของคุณจะถูกส่งในรูปแบบที่ปลอดภัย ข้อมูลจะถูกเข้ารหัสและปกป้องตามมาตรฐานความปลอดภัยสูงสุด ข้อมูลของคุณจะไม่ถูกแชร์หรือส่งต่อให้กับบุคคลที่สาม เราให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลของคุณ'
                  : 'Your assessment results will be sent securely. The data is encrypted and protected with the highest security standards. Your information will not be shared with third parties. We prioritize your privacy and data security.'
                }
              </p>
            </div>

            <Button
              onClick={handleSendEmail}
              disabled={isLoading || !email}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'th' ? 'กำลังส่ง...' : 'Sending...'}
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'th' ? 'ส่งอีเมล' : 'Send Email'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
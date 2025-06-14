import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Home, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocation } from 'wouter';
import { Role } from '@shared/schema';

const roleOptions = [
  {
    id: 'founder' as Role,
    icon: Crown,
    titleKey: 'role.founder',
    descriptionKey: 'role.founder.description',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'family-employee' as Role,
    icon: Users,
    titleKey: 'role.familyEmployee',
    descriptionKey: 'role.familyEmployee.description',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'family-non-employee' as Role,
    icon: Home,
    titleKey: 'role.familyNonEmployee',
    descriptionKey: 'role.familyNonEmployee.description',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'external-advisor' as Role,
    icon: Handshake,
    titleKey: 'role.externalAdvisor',
    descriptionKey: 'role.externalAdvisor.description',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export function RoleSelection() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { setRole, resetAssessment } = useAssessment();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    // Reset assessment to start fresh, then set the role
    resetAssessment();
    setRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setLocation('/assessment');
    }
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
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy mb-2 gradient-text">
          {t('role.title')}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base px-4">
          {t('role.subtitle')}
        </p>
      </motion.div>
      {/* Role Cards - Single column on mobile */}
      <div className="flex-1 space-y-4 mb-8">
        {roleOptions.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 hover:border-primary/50 active:border-primary'
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${role.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`text-lg sm:text-xl ${role.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-navy mb-1">
                        {t(role.titleKey)}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base">
                        {t(role.descriptionKey)}
                      </p>
                    </div>
                    {/* Selection indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center ${
                      isSelected ? 'bg-primary' : 'bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {/* Continue Button */}
      <motion.div 
        className="text-center text-[18px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('role.continue')}
        </Button>
      </motion.div>
    </div>
  );
}

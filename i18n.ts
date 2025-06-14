// client/src/hooks/useLanguage.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'en' | 'th';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing Page
    'landing.title': 'Family Business Compass',
    'landing.subtitle': 'Assessment Tool',
    'landing.description':
      'Discover your family business strengths across 4 key dimensions.',
    'landing.startAssessment': 'Start Assessment',
    'landing.duration': '15-20 minutes',
    'landing.questions': '12 Questions',
    'landing.detailedResults': 'Detailed Results',
    'landing.copyright': '© 2025 The Quant Group & Family Business Asia. All rights reserved.',
    'footer.version_info': 'Version: 1.0.0 | Family Wealth Compass',

    // Name Input Page
    'nameInput.title': 'What should we call you?',
    'nameInput.subtitle': 'Enter your name or nickname to personalize your assessment results.',
    'nameInput.label': 'Your Name',
    'nameInput.placeholder': 'e.g., John Doe or Family Representative',
    'nameInput.continueButton': 'Continue',
    'nameInput.skipButton': 'Skip',

    // Role Selection
    'role.title': 'Select Your Role',
    'role.subtitle': 'Choose the role that best describes your position in the family business',
    'role.founder': 'Founder',
    'role.founder.description': 'Started or established the family business',
    'role.familyEmployee': 'Family Member/Employee',
    'role.familyEmployee.description': 'Family member actively working in the business',
    'role.familyNonEmployee': 'Family Member/Non-Employee',
    'role.familyNonEmployee.description': 'Family member not directly working in the business',
    'role.externalAdvisor': 'External Management/Advisor',
    'role.externalAdvisor.description': 'Non-family professional working with the business',
    'role.continue': 'Continue to Assessment',

    // Assessment
    'assessment.progress': 'Question',
    'assessment.of': 'of',
    'assessment.previous': 'Previous',
    'assessment.next': 'Next',
    'assessment.complete': 'Complete Assessment',

    // Dimensions (ชื่อมิติที่ใช้ใน results.tsx และ radar chart)
    'dimension.governance': 'Governance',
    'dimension.legacy': 'Legacy',
    'dimension.relationships': 'Relationship', // แก้ไข: ไม่มี S
    'Strategy': 'Strategy', // ใช้คีย์ 'Strategy' ตรงๆ สำหรับกราฟ
    'dimension.entrepreneurship': 'Strategy', // ให้คีย์เก่าชี้ไปที่คำแปลของ Strategy ด้วย

    // Dimension Descriptions
    'dimension.governance.description':
      'Creating clear structures, processes, and agreements for family decision-making, wealth management, and conflict resolution. At the center is the Family Constitution—the foundational document that codifies the family\'s values, rules, and operating principles for managing wealth across generations.',
    'dimension.legacy.description':
      'The comprehensive inheritance that families create and transfer across generations—encompassing family values, traditions, reputation, and financial resources. This represents both the tangible and intangible assets that define the family\'s identity and enable future generations to thrive.',
    'dimension.relationships.description':
      'Building and maintaining strong relationships among family members through effective communication, trust-building, teamwork, conflict management, and next-generation preparation.',
    'dimension.strategy.description':
      'A systematic approach to ensuring long-term success and continuity of the family. This includes choosing the family\'s basic financial path: focus on spending to support current generation\'s lifestyle or emphasize growth to preserve and increase assets for multiple generations? This choice impacts all aspects of financial management, acceptable risk levels, and long-term planning.',
    'dimension.entrepreneurship.description': // คีย์เก่าชี้ไปคำอธิบาย Strategy ด้วย
      'A systematic approach to ensuring long-term success and continuity of the family. This includes choosing the family\'s basic financial path: focus on spending to support current generation\'s lifestyle or emphasize growth to preserve and increase assets for multiple generations? This choice impacts all aspects of financial management, acceptable risk levels, and long-term planning.',


    // Results
    'results.title': 'Your Family Business Compass Results',
    'results.subtitle': 'Comprehensive analysis across 4 key dimensions',
    'results.family_wealth_compass': 'Family Wealth Compass', // เพิ่มคีย์นี้
    'results.compassVisualization': 'Compass Visualization',
    'results.overallAssessment': 'Overall Assessment',
    'results.dimensionScores': 'Dimension Scores',
    'results.insights': 'Key Insights & Recommendations',
    'results.strengths': 'Strengths',
    'results.development': 'Development Opportunities',
    'results.shareResults': 'Share Your Results',
    'results.saveAsPDF': 'Save as PDF',
    'results.emailResults': 'Email Results',
    'results.shareLink': 'Share Link',
    'results.retakeAssessment': 'Take Assessment Again',

    // Score Levels
    'level.excellent': 'Excellent',
    'level.good': 'Good',
    'level.moderate': 'Moderate',
    'level.needs-improvement': 'Needs Improvement',
    'level.critical': 'Critical',

    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.totalResponses': 'Total Responses',
    'admin.avgScore': 'Avg. Score',
    'admin.completionRate': 'Completion Rate',
    'admin.thisMonth': 'This Month',
    'admin.exportCSV': 'Export Data (CSV)',
    'admin.analyticsReport': 'Analytics Report',
    'admin.resetDatabase': 'Reset Database',
    'admin.login': 'Login',
    'admin.logout': 'ออกจากระบบ',
    'admin.loginSuccess': 'เข้าสู่ระบบสำเร็จ',
    'admin.invalidCredentials': 'Invalid credentials',
    'admin.loginError': 'Failed to log in',
    'admin.responseDeleted': 'Response deleted successfully',
    'admin.deleteFailed': 'Failed to delete response',
    'admin.databaseReset': 'Database reset successfully',
    'admin.resetFailed': 'Failed to reset database',
    'admin.addAdminSuccess': 'Admin user added successfully',
    'admin.addAdminFailed': 'เพิ่มผู้ดูแลระบบไม่สำเร็จ',
    'admin.addAdminError': 'An error occurred while adding admin user',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.addAdmin': 'Add Admin',
    'admin.addAdminTitle': 'Add New Admin User',
    'admin.addAdminDescription': 'Enter details for the new admin user.',
    'admin.addAdminSave': 'Add User',
    'admin.confirmResetTitle': 'Confirm Database Reset',
    'admin.confirmResetDescription': 'Are you sure you want to delete all assessment responses? This action cannot be undone.',
    'admin.resetConfirm': 'Reset Database',
    'admin.recentResponses': 'Recent Responses',
    'admin.noResponsesYet': 'No assessment responses yet',
    'admin.averageAssessmentResults': 'Average Assessment Results',
    'admin.averageScoresByDimension': 'Average Scores by Dimension',
    'admin.governance': 'Governance',
    'admin.legacy': 'Legacy',
    'admin.relationships': 'Relationship', // แก้ไข: ไม่มี S
    'admin.strategy': 'Strategy',
    'admin.overallAverage': 'Overall Average',

    // Table Headers
    'table.date': 'Date',
    'table.time': 'Time',
    'table.role': 'Role',
    'table.overallScore': 'Overall Score',
    'table.governance': 'Governance',
    'table.legacy': 'Legacy',
    'table.relationships': 'Relationship', // แก้ไข: ไม่มี S
    'table.strategy': 'Strategy',
    'table.actions': 'Actions',
    'table.viewDetails': 'View Details',
    'table.viewDetailsDescription': 'Detailed view functionality would be implemented here',
  },
  th: {
    // Landing Page
    'landing.title': 'เข็มทิศธุรกิจครอบครัว',
    'landing.subtitle': 'เครื่องมือประเมิน',
    'landing.description':
      'ค้นพบจุดแข็งของธุรกิจครอบครัวใน 4 มิติสำคัญ',
    'landing.startAssessment': 'เริ่มการประเมิน',
    'landing.duration': '15-20 นาที',
    'landing.questions': '12 คำถาม',
    'landing.detailedResults': 'ผลลัพธ์ละเอียด',
    'landing.copyright': '© 2025 The Quant Group & Family Business Asia สงวนลิขสิทธิ์',
    'footer.version_info': 'เวอร์ชัน: 1.0.0 | เข็มทิศความมั่งคั่งครอบครัว',

    // Name Input Page
    'nameInput.title': 'เราควรเรียกคุณว่าอะไรดี?',
    'nameInput.subtitle': 'กรุณาใส่ชื่อหรือชื่อเล่นของคุณ เพื่อปรับผลการประเมินให้เป็นของคุณมากยิ่งขึ้น',
    'nameInput.label': 'ชื่อของคุณ',
    'nameInput.placeholder': 'เช่น สมชาย หรือ ตัวแทนครอบครัว',
    'nameInput.continueButton': 'ดำเนินการต่อ',
    'nameInput.skipButton': 'ข้าม',

    // Role Selection
    'role.title': 'เลือกบทบาทของคุณ',
    'role.subtitle': 'เลือกบทบาทที่อธิบายตำแหน่งของคุณในธุรกิจครอบครัวได้ดีที่สุด',
    'role.founder': 'ผู้ก่อตั้ง',
    'role.founder.description': 'เป็นผู้เริ่มต้นหรือก่อตั้งธุรกิจครอบครัว',
    'role.familyEmployee': 'สมาชิกครอบครัว/พนักงาน',
    'role.familyEmployee.description': 'สมาชิกครอบครัวที่ทำงานในธุรกิจอย่างแข็งขัน',
    'role.familyNonEmployee': 'สมาชิกครอบครัว/ไม่ใช่พนักงาน',
    'role.familyNonEmployee.description': 'สมาชิกครอบครัวที่ไม่ได้ทำงานในธุรกิจโดยตรง',
    'role.externalAdvisor': 'ผู้บริหารภายนอก/ที่ปรึกษา',
    'role.externalAdvisor.description': 'ผู้เชี่ยวชาญภายนอกที่ทำงานร่วมกับธุรกิจ',
    'role.continue': 'ดำเนินการต่อไปยังการประเมิน',

    // Assessment
    'assessment.progress': 'คำถาม',
    'assessment.of': 'จาก',
    'assessment.previous': 'ก่อนหน้า',
    'assessment.next': 'ถัดไป',
    'assessment.complete': 'เสร็จสิ้นการประเมิน',

    // Dimensions (ชื่อมิติที่ใช้ใน results.tsx และ radar chart)
    'dimension.governance': 'การกำกับดูแล',
    'dimension.legacy': 'มรดกตกทอด',
    'dimension.relationships': 'ความสัมพันธ์', // แก้ไข: ไม่มี S
    'Strategy': 'กลยุทธ์', // ใช้คีย์ 'Strategy' ตรงๆ สำหรับกราฟ
    'dimension.entrepreneurship': 'กลยุทธ์', // ให้คีย์เก่าชี้ไปที่คำแปลของ Strategy ด้วย

    // Dimension Descriptions
    'dimension.governance.description':
      'การสร้างโครงสร้างและกระบวนการที่ชัดเจนสำหรับการบริหารจัดการธุรกิจครอบครัวอย่างมีประสิทธิภาพ ครอบคลุมตั้งแต่ธรรมนูญครอบครัว การตัดสินใจ การแยกทรัพย์สิน การแก้ไขความขัดแย้ง การสืบทอดกิจการ และการสร้างความโปร่งใส',
    'dimension.legacy.description':
      'การสืบทอดและพัฒนาค่านิยม จุดมุ่งหมาย ชื่อเสียง และจุดแข็งเฉพาะของครอบครัว เพื่อสร้างความได้เปรียบในการแข่งขัน รวมถึงการมีส่วนร่วมกับสังคม การสื่อสารมรดกทางธุรกิจ และการปรับให้ทันสมัยอย่างต่อเนื่อง',
    'dimension.relationships.description':
      'การสร้างและรักษาความสัมพันธ์ที่เข้มแข็งระหว่างสมาชิกครอบครัว ผ่านการสื่อสารที่มีประสิทธิภาพ การสร้างความไว้วางใจ การทำงานเป็นทีม การจัดการความขัดแย้ง และการเตรียมความพร้อมสำหรับการพัฒนาคนรุ่นต่อไป',
    'dimension.strategy.description':
      'แนวทางอย่างเป็นระบบเพื่อรับประกันความสำเร็จระยะยาวและความต่อเนื่องของครอบครัว ซึ่งรวมถึงการเลือกเส้นทางการเงินพื้นฐานของครอบครัว: เราจะเน้นการใช้จ่ายเพื่อรองรับวิถีชีวิตของคนในครอบครัวปัจจุบัน หรือจะเน้นการเติบโตเพื่อรักษาและเพิ่มทรัพย์สินสำหรับหลายรุ่น? ทางเลือกนี้จะส่งผลต่อทุกด้านของการจัดการเงิน ระดับความเสี่ยงที่ยอมรับได้ และการวางแผนระยะยาว',
    'dimension.entrepreneurship.description': // คีย์เก่าชี้ไปคำอธิบาย Strategy ด้วย
      'แนวทางอย่างเป็นระบบเพื่อรับประกันความสำเร็จระยะยาวและความต่อเนื่องของครอบครัว ซึ่งรวมถึงการเลือกเส้นทางการเงินพื้นฐานของครอบครัว: เราจะเน้นการใช้จ่ายเพื่อรองรับวิถีชีวิตของคนในครอบครัวปัจจุบัน หรือจะเน้นการเติบโตเพื่อรักษาและเพิ่มทรัพย์สินสำหรับหลายรุ่น? ทางเลือกนี้จะส่งผลต่อทุกด้านของการจัดการเงิน ระดับความเสี่ยงที่ยอมรับได้ และการวางแผนระยะยาว',


    // Results
    'results.title': 'ผลลัพธ์เข็มทิศธุรกิจครอบครัวของคุณ',
    'results.subtitle': 'การวิเคราะห์ครอบคลุมใน 4 มิติสำคัญ',
    'results.family_wealth_compass': 'เข็มทิศความมั่งคั่งครอบครัว', // เพิ่มคีย์นี้
    'results.compassVisualization': 'การแสดงผลเข็มทิศ',
    'results.overallAssessment': 'การประเมินโดยรวม',
    'results.dimensionScores': 'คะแนนแต่ละมิติ',
    'results.insights': 'ข้อมูลเชิงลึกและคำแนะนำสำคัญ',
    'results.strengths': 'จุดแข็ง',
    'results.development': 'โอกาสในการพัฒนา',
    'results.shareResults': 'แบ่งปันผลลัพธ์ของคุณ',
    'results.saveAsPDF': 'บันทึกเป็น PDF',
    'results.emailResults': 'ส่งผลลัพธ์ทางอีเมล',
    'results.shareLink': 'แบ่งปันลิงก์',
    'results.retakeAssessment': 'ทำแบบประเมินอีกครั้ง',

    // Score Levels
    'level.excellent': 'ยอดเยี่ยม',
    'level.good': 'ดี',
    'level.moderate': 'ปานกลาง',
    'level.needs-improvement': 'กำลังพัฒนา',
    'level.critical': 'ต้องให้ความสำคัญ',

    // Admin
    'admin.title': 'แดชบอร์ดผู้ดูแล',
    'admin.totalResponses': 'จำนวนการตอบรวม',
    'admin.avgScore': 'คะแนนเฉลี่ย',
    'admin.completionRate': 'อัตราการเสร็จสิ้น',
    'admin.thisMonth': 'เดือนนี้',
    'admin.exportCSV': 'ส่งออกข้อมูล (CSV)',
    'admin.analyticsReport': 'รายงานการวิเคราะห์',
    'admin.resetDatabase': 'รีเซ็ตฐานข้อมูล',
    'admin.login': 'เข้าสู่ระบบ',
    'admin.logout': 'ออกจากระบบ',
    'admin.loginSuccess': 'เข้าสู่ระบบสำเร็จ',
    'admin.invalidCredentials': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    'admin.loginError': 'ไม่สามารถเข้าสู่ระบบได้',
    'admin.responseDeleted': 'ลบข้อมูลสำเร็จ',
    'admin.deleteFailed': 'ลบข้อมูลไม่สำเร็จ',
    'admin.databaseReset': 'รีเซ็ตฐานข้อมูลสำเร็จ',
    'admin.resetFailed': 'รีเซ็ตฐานข้อมูลไม่สำเร็จ',
    'admin.addAdminSuccess': 'เพิ่มผู้ดูแลระบบสำเร็จ',
    'admin.addAdminFailed': 'เพิ่มผู้ดูแลระบบไม่สำเร็จ',
    'admin.addAdminError': 'เกิดข้อผิดพลาดในการเพิ่มผู้ดูแลระบบ',
    'admin.username': 'ชื่อผู้ใช้',
    'admin.password': 'รหัสผ่าน',
    'admin.addAdmin': 'เพิ่มผู้ดูแลระบบ',
    'admin.addAdminTitle': 'เพิ่มผู้ดูแลระบบใหม่',
    'admin.addAdminDescription': 'กรอกรายละเอียดสำหรับผู้ดูแลระบบใหม่',
    'admin.addAdminSave': 'เพิ่มผู้ใช้',
    'admin.confirmResetTitle': 'ยืนยันการรีเซ็ตฐานข้อมูล',
    'admin.confirmResetDescription': 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการประเมินทั้งหมด? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    'admin.resetConfirm': 'รีเซ็ตฐานข้อมูล',
    'admin.recentResponses': 'การตอบล่าสุด',
    'admin.noResponsesYet': 'ยังไม่มีผลการประเมิน',
    'admin.averageAssessmentResults': 'ผลการประเมินโดยเฉลี่ย',
    'admin.averageScoresByDimension': 'คะแนนเฉลี่ยตามมิติ',
    'admin.governance': 'การกำกับดูแล',
    'admin.legacy': 'มรดกตกทอด',
    'admin.relationships': 'ความสัมพันธ์', // แก้ไข: ไม่มี S
    'admin.strategy': 'กลยุทธ์',
    'admin.overallAverage': 'คะแนนเฉลี่ยโดยรวม',

    // Table Headers
    'table.date': 'วันที่',
    'table.time': 'เวลา',
    'table.role': 'บทบาท',
    'table.overallScore': 'คะแนนรวม',
    'table.governance': 'การกำกับดูแล',
    'table.legacy': 'มรดกตกทอด',
    'table.relationships': 'ความสัมพันธ์', // แก้ไข: ไม่มี S
    'table.strategy': 'กลยุทธ์',
    'table.actions': 'การดำเนินการ',
    'table.viewDetails': 'ดูรายละเอียด',
    'table.viewDetailsDescription': 'ฟังก์ชันดูรายละเอียดจะถูกนำมาใช้ที่นี่',
  },
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language }),
      t: (key: string) => {
        const lang = get().language;
        return translations[lang][key] || key;
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
    }
  )
);
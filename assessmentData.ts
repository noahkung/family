// client/src/lib/assessmentData.ts

import { Question, Dimension } from '@shared/schema';

export const ASSESSMENT_QUESTIONS = [
    // Governance (การกำกับดูแล) - 3 คำถาม (ID: 1.1 - 1.3)
    {
        id: '1.1',
        dimension: 'governance',
        question: {
            en: 'Does your family have a Family Constitution or written charter that outlines your values, rules, and operating principles?',
            th: 'G1. ครอบครัวของท่านมีธรรมนูญครอบครัวหรือข้อตกลงเป็นลายลักษณ์อักษรที่ระบุค่านิยม กฎเกณฑ์ และหลักการดำเนินชีวิตหรือไม่?'
        },
        options: {
            A: { text: { en: 'Yes, comprehensive and actively used', th: 'ก. มีและใช้งานจริงอย่างครบถ้วน' }, points: 4 },
            B: { text: { en: 'Yes, but needs updating or not consistently used', th: 'ข. มีแต่ต้องปรับปรุงหรือไม่ได้ใช้อย่างสม่ำเสมอ' }, points: 3 },
            C: { text: { en: 'Some written agreements but no comprehensive constitution', th: 'ค. มีข้อตกลงบางเรื่องแต่ไม่ครอบคลุมทั้งหมด' }, points: 2 },
            D: { text: { en: 'No Family Constitution or written charter', th: 'ง. ไม่มีธรรมนูญครอบครัวหรือข้อตกลงเป็นลายลักษณ์อักษร' }, points: 1 }
        }
    },
    {
        id: '1.2',
        dimension: 'governance',
        question: {
            en: 'How effective are your family\'s processes for making important financial and wealth decisions?',
            th: 'G2. กระบวนการตัดสินใจของครอบครัวเกี่ยวกับเรื่องเงินและทรัพย์สินที่สำคัญมีประสิทธิภาพแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very effective with clear structures and authority levels', th: 'ก. มีประสิทธิภาพมาก มีโครงสร้างและการแบ่งหน้าที่ที่ชัดเจน' }, points: 4 },
            B: { text: { en: 'Mostly effective but could be more streamlined', th: 'ข. ค่อนข้างมีประสิทธิภาพ แต่อาจปรับให้คล่องตัวขึ้นได้' }, points: 3 },
            C: { text: { en: 'Somewhat effective but often slow', th: 'ค. พอใช้ได้ แต่มักใช้เวลานาน' }, points: 2 },
            D: { text: { en: 'Not effective - unclear, slow, or causes conflicts', th: 'ง. ไม่มีประสิทธิภาพ - ไม่ชัดเจน ช้า หรือเกิดความขัดแย้ง' }, points: 1 }
        }
    },
    {
        id: '1.3',
        dimension: 'governance',
        question: {
            en: 'How well does your family handle conflicts and disagreements about wealth and family matters?',
            th: 'G3. ครอบครัวของท่านจัดการกับความขัดแย้งและความเห็นต่างเกี่ยวกับเรื่องเงินและครอบครัวได้ดีแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very well with established processes for quick resolution', th: 'ก. ดีมาก มีวิธีการที่ตกลงกันไว้สำหรับแก้ปัญหาอย่างรวดเร็ว' }, points: 4 },
            B: { text: { en: 'Well through discussion, though emotions sometimes involved', th: 'ข. ดี สามารถคุยกันได้ แม้ว่าบางครั้งจะมีอารมณ์เข้ามาเกี่ยวข้อง' }, points: 3 },
            C: { text: { en: 'Somewhat defined but not consistently discussed across the family', th: 'ค. พอชัดเจน แต่ไม่ได้พูดคุยกันสม่ำเสมอ' }, points: 2 },
            D: { text: { en: 'Not well - conflicts escalate or remain unresolved', th: 'ง. ไม่ดี - ปัญหาใหญ่ขึ้นหรือไม่ได้รับการแก้ไข' }, points: 1 }
        }
    },

    // Legacy (มรดกตกทอด) - 3 คำถาม (ID: 2.1 - 2.3)
    {
        id: '2.1',
        dimension: 'legacy',
        question: {
            en: 'How well defined and shared are your family\'s core values, purpose, and identity?',
            th: 'L1. ค่านิยมหลัก จุดมุ่งหมาย และเอกลักษณ์ของครอบครัวชัดเจนและเข้าใจตรงกันแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very well defined - all members understand and embrace our family values and mission', th: 'ก. ชัดเจนมาก - ทุกคนในครอบครัวเข้าใจและยึดถือค่านิยมและเป้าหมายของครอบครัว' }, points: 4 },
            B: { text: { en: 'Well defined - most members understand our family purpose and identity', th: 'ข. ค่อนข้างชัดเจน - คนส่วนใหญ่เข้าใจจุดมุ่งหมายและเอกลักษณ์ของครอบครัว' }, points: 3 },
            C: { text: { en: 'Somewhat defined but not consistently discussed across the family', th: 'ค. พอชัดเจน แต่ไม่ได้พูดคุยกันสม่ำเสมอ' }, points: 2 },
            D: { text: { en: 'Not well defined - family values and purpose unclear', th: 'ง. ไม่ค่อยชัดเจน - ค่านิยมและจุดมุ่งหมายของครอบครัวยังไม่แน่ชัด' }, points: 1 }
        }
    },
    {
        id: '2.2',
        dimension: 'legacy',
        question: {
            en: 'How comprehensive is your family\'s wealth transfer and estate planning?',
            th: 'L2. การวางแผนการส่งต่อทรัพย์สินและมรดกของครอบครัวครอบคลุมแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very comprehensive with current wills, trusts, and succession plans', th: 'ก. ครอบคลุมมาก มีพินัยกรรม กองทุน และแผนการสืบทอดที่เป็นปัจจุบัน' }, points: 4 },
            B: { text: { en: 'Comprehensive with good documents and minor gaps', th: 'ข. ค่อนข้างครอบคลุม มีเอกสารที่ดีแต่อาจมีรายละเอียดที่ต้องเพิ่มเติม' }, points: 3 },
            C: { text: { en: 'Basic planning with essential documents but lacks strategy', th: 'ค. วางแผนพื้นฐาน มีเอกสารจำเป็นแต่ยังขาดกลยุทธ์ที่ชัดเจน' }, points: 2 },
            D: { text: { en: 'Inadequate planning without proper documentation', th: 'ง. วางแผนไม่เพียงพอ ไม่มีเอกสารที่เหมาะสม' }, points: 1 }
        }
    },
    {
        id: '2.3',
        dimension: 'legacy',
        question: {
            en: 'How aligned is your family\'s community engagement and philanthropy with your family\'s core values and mission?',
            th: 'L3. การทำบุญทำทานและการมีส่วนร่วมกับสังคมของครอบครัวสอดคล้องกับค่านิยมและเป้าหมายของครอบครัวแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Highly aligned - philanthropy is central to our family\'s mission, reinforcing our shared values and strengthening family bonds across generations.', th: 'ก. สอดคล้องมาก - การทำบุญเป็นหัวใจหลักของครอบครัว ช่วยเสริมสร้างค่านิยมร่วมและความสัมพันธ์ที่แน่นแฟ้นข้ามรุ่น' }, points: 4 },
            B: { text: { en: 'Well aligned - actively engage in activities reflecting family values', th: 'ข. ค่อนข้างสอดคล้อง - มีส่วนร่วมในกิจกรรมที่สะท้อนค่านิยมครอบครัวอย่างแข็งขัน' }, points: 3 },
            C: { text: { en: 'Somewhat defined but not consistently discussed across the family', th: 'ค. พอสอดคล้อง - ช่วยเหลือเป็นครั้งคราวแต่ไม่เป็นระบบ' }, points: 2 },
            D: { text: { en: 'Not aligned - giving not current focus or misaligned with values', th: 'ง. ไม่ค่อยสอดคล้อง - การให้ไม่ใช่ความสำคัญหลักหรือไม่ตรงกับค่านิยม' }, points: 1 }
        }
    },

    // Relationships (ความสัมพันธ์) - 3 คำถาม (ID: 3.1 - 3.3)
    {
        id: '3.1',
        dimension: 'relationships',
        question: {
            en: 'How would you describe communication within your family about money and wealth matters?',
            th: 'R1. ท่านจะอธิบายการสื่อสารในครอบครัวเกี่ยวกับเรื่องเงินและทรัพย์สินอย่างไร?'
        },
        options: {
            A: { text: { en: 'Open, honest, and constructive - comfortable discussing money', th: 'ก. เปิดเผย ตรงไปตรงมา และสร้างสรรค์ - สบายใจพูดคุยเรื่องเงิน' }, points: 4 },
            B: { text: { en: 'Generally good but some topics remain sensitive', th: 'ข. โดยรวมดี แต่บางเรื่องยังคงเป็นเรื่องละเอียดอ่อน' }, points: 3 },
            C: { text: { en: 'Mixed - varies by topic and people involved', th: 'ค. ขึ้นอยู่กับเรื่องและคนที่เกี่ยวข้อง' }, points: 2 },
            D: { text: { en: 'Poor - money conversations avoided or cause tension', th: 'ง. ไม่ดี - หลีกเลี่ยงการพูดคุยเรื่องเงินหรือทำให้เกิดความตึงเครียด' }, points: 1 }
        }
    },
    {
        id: '3.2',
        dimension: 'relationships',
        question: {
            en: 'How well is the next generation being prepared for wealth responsibility?',
            th: 'R2. ลูกหลานได้รับการเตรียมความพร้อมสำหรับความรับผิดชอบด้านทรัพย์สินดีแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Excellent preparation through formal education, mentorship, and progressively responsible roles, including a track record of success outside the family enterprise.', th: 'ก. เตรียมความพร้อมได้ยอดเยี่ยม ผ่านการศึกษาอย่างเป็นระบบ การแนะนำ และการให้ความรับผิดชอบเพิ่มขึ้นทีละน้อย รวมถึงประสบการณ์ความสำเร็จนอกครอบครัว' }, points: 4 },
            B: { text: { en: 'Good preparation with regular discussions and educational opportunities', th: 'ข. เตรียมความพร้อมได้ดี มีการพูดคุยสม่ำเสมอและโอกาสการเรียนรู้' }, points: 3 },
            C: { text: { en: 'Basic preparation but could be more systematic', th: 'ค. เตรียมความพร้อมระดับพื้นฐาน แต่น่าจะเป็นระบบมากกว่านี้' }, points: 2 },
            D: { text: { en: 'Poor preparation - limited next generation education', th: 'ง. เตรียมความพร้อมไม่ดี - การให้ความรู้ลูกหลานยังจำกัด' }, points: 1 }
        }
    },
    {
        id: '3.3',
        dimension: 'relationships',
        question: {
            en: 'How unified is your family around important goals and priorities?',
            th: 'R3. ครอบครัวของท่านมีความเป็นน้ำหนึ่งใจเดียวกันเกี่ยวกับเป้าหมายและสิ่งที่สำคัญแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very unified - strong alignment on family goals and priorities', th: 'ก. เป็นน้ำหนึ่งใจเดียวมาก - ทุกคนมีเป้าหมายและความสำคัญที่ตรงกัน' }, points: 4 },
            B: { text: { en: 'Mostly unified with minor differences in approaches', th: 'ข. ส่วนใหญ่เป็นน้ำหนึ่งใจเดียว มีความแตกต่างเล็กน้อยในวิธีการ' }, points: 3 },
            C: { text: { en: 'Somewhat unified but significant differences on important issues', th: 'ค. พอเป็นน้ำหนึ่งใจเดียว แต่มีความเห็นต่างในเรื่องสำคัญบ้าง' }, points: 2 },
            D: { text: { en: 'Not unified - major disagreements about family direction', th: 'ง. ไม่ค่อยเป็นน้ำหนึ่งใจเดียวกัน - มีความเห็นต่างใหญ่เกี่ยวกับทิศทางครอบครัว' }, points: 1 }
        }
    },

    // Strategy (กลยุทธ์) - 3 คำถาม (ID: 4.1 - 4.3)
    {
        id: '4.1',
        dimension: 'strategy',
        question: {
            en: 'S1. Does your family have a systematic approach to long-term planning, such as a designated \'Wealth Strategist\' or leadership team responsible for your overall wealth strategy?',
            th: 'S1. ครอบครัวของท่านมีแนวทางเป็นระบบในการวางแผนระยะยาว เช่น มี \'ที่ปรึกษากลยุทธ์ความมั่งคั่ง\' หรือทีมที่รับผิดชอบกลยุทธ์ทรัพย์สินโดยรวมหรือไม่?'
        },
        options: {
            A: { text: { en: 'Yes, we have a formally recognized Wealth Strategist/team driving a comprehensive long-term plan.', th: 'ก. มี เรามีที่ปรึกษากลยุทธ์ความมั่งคั่ง/ทีมที่ได้รับการยอมรับอย่างเป็นทางการที่วางแผนระยะยาวอย่างครอบคลุม' }, points: 4 },
            B: { text: { en: 'Yes, we have good long-term planning, though leadership responsibilities could be clearer.', th: 'ข. มี เรามีการวางแผนระยะยาวที่ดี แม้ว่าความรับผิดชอบในการเป็นผู้นำอาจจะชัดเจนขึ้นได้' }, points: 3 },
            C: { text: { en: 'We do some informal planning, but it\'s not systematic or clearly led.', th: 'ค. เราวางแผนกันไม่เป็นทางการบ้าง แต่ไม่เป็นระบบหรือมีผู้รับผิดชอบที่ชัดเจน' }, points: 2 },
            D: { text: { en: 'No, we lack a systematic approach to long-term planning and a designated leader.', th: 'ง. ไม่มี เราขาดแนวทางเป็นระบบในการวางแผนระยะยาวและคนที่รับผิดชอบ' }, points: 1 }
        }
    },
    {
        id: '4.2',
        dimension: 'strategy',
        question: {
            en: 'S2. How clearly has your family defined its primary long-term financial objective, which guides your wealth strategy?',
            th: 'S2. ครอบครัวของท่านได้กำหนดเป้าหมายทางการเงินระยะยาวหลักที่เป็นแนวทางกลยุทธ์ทรัพย์สินชัดเจนแค่ไหน?'
        },
        options: {
            A: { text: { en: 'Very clearly defined as Growth-Oriented (growing real per-capita wealth for future generations).', th: 'ก. กำหนดชัดเจนมาก เป็นแบบมุ่งเน้นการเติบโต (เพิ่มทรัพย์สินต่อคนจริงๆ สำหรับลูกหลาน)' }, points: 4 },
            B: { text: { en: 'Clearly defined as Conservation-Oriented (preserving purchasing power over the long term).', th: 'ข. กำหนดชัดเจน เป็นแบบมุ่งเน้นการอนุรักษ์ (รักษาอำนาจซื้อในระยะยาว)' }, points: 3 },
            C: { text: { en: 'Generally understood as Distribution-Oriented (supporting the current generation\'s lifestyle).', th: 'ค. เข้าใจกันโดยทั่วไป เป็นแบบมุ่งเน้นการใช้จ่าย (รองรับวิถีชีวิตของคนรุ่นปัจจุบัน)' }, points: 2 },
            D: { text: { en: 'Our family has not formally defined a collective long-term financial objective.', th: 'ง. ครอบครัวเรายังไม่ได้กำหนดเป้าหมายทางการเงินระยะยาวร่วมกันอย่างเป็นทางการ' }, points: 1 }
        }
    },
    {
        id: '4.3',
        dimension: 'strategy',
        question: {
            en: 'S3. How well does your family approach overall risk management and diversification of its assets?',
            th: 'S3. ครอบครัวของคุณมีแนวทางในการบริหารความเสี่ยงโดยรวมและการกระจายความเสี่ยงของสินทรัพย์ได้ดีเพียงใด?'
        },
        options: {
            A: { text: { en: 'Excellent: There is a clear risk management policy and assets are professionally diversified', th: 'ก. ยอดเยี่ยม: มีนโยบายการบริหารความเสี่ยงที่ชัดเจน และมีการกระจายความเสี่ยงของสินทรัพย์อย่างมืออาชีพ' }, points: 4 },
            B: { text: { en: 'Good: There is a good understanding of risk management and good diversification', th: 'ข. ดี: มีความเข้าใจที่ดีเกี่ยวกับการบริหารความเสี่ยง และมีการกระจายความเสี่ยงที่ดี' }, points: 3 },
            C: { text: { en: 'Moderate: We have some diversification but lack a systematic approach to risk management', th: 'ค. พอใช้: เรามีการกระจายความเสี่ยงบ้าง แต่ขาดแนวทางการบริหารความเสี่ยงที่เป็นระบบ' }, points: 2 },
            D: { text: { en: 'There is very limited diversification and risk management', th: 'ง. ต้องพัฒนา: มีการกระจายความเสี่ยงและการบริหารความเสี่ยงที่จำกัดมาก' }, points: 1 }
        }
    },
];

export function calculateDimensionScore(dimension: Dimension, answers: Record<string, 'A' | 'B' | 'C' | 'D'>): number {
    const dimensionQuestions = ASSESSMENT_QUESTIONS.filter(q => q.dimension === dimension);
    let totalScore = 0;

    dimensionQuestions.forEach(question => {
        const answer = answers[question.id];
        if (answer) {
            totalScore += question.options[answer].points;
        }
    });

    return totalScore;
}

export function getScoreLevel(percentage: number): 'critical' | 'needs-improvement' | 'moderate' | 'good' | 'excellent' {
    if (percentage >= 81) return 'excellent';
    if (percentage >= 61) return 'good';
    if (percentage >= 51) return 'moderate';
    if (percentage >= 31) return 'needs-improvement';
    return 'critical';
}
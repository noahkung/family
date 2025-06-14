// shared/schema.ts

import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // founder, family-employee, family-non-employee, external-advisor
  userName: text("user_name"), // คอลัมน์ userName - อนุญาตให้เป็น NULL ใน DB (ถ้าไม่มี .notNull())
  // Individual question scores (1-12) - ลดเหลือ 12 คำถาม
  q1Score: integer("q1_score").notNull(),
  q2Score: integer("q2_score").notNull(),
  q3Score: integer("q3_score").notNull(),
  q4Score: integer("q4_score").notNull(),
  q5Score: integer("q5_score").notNull(),
  q6Score: integer("q6_score").notNull(),
  q7Score: integer("q7_score").notNull(),
  q8Score: integer("q8_score").notNull(),
  q9Score: integer("q9_score").notNull(),
  q10Score: integer("q10_score").notNull(),
  q11Score: integer("q11_score").notNull(),
  q12Score: integer("q12_score").notNull(),

  // Calculated dimension scores
  governanceScore: integer("governance_score").notNull(),
  legacyScore: integer("legacy_score").notNull(),
  relationshipsScore: integer("relationships_score").notNull(),
  strategyScore: integer("strategy_score").notNull(), // เปลี่ยนจาก entrepreneurship_score
  overallScore: integer("overall_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// แก้ไข insertAssessmentResponseSchema เพื่อให้ userName สามารถเป็น string หรือ null ได้
export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // จุดสำคัญ: ต้องเป็น .nullable().optional() เพื่อยอมรับทั้ง null และ undefined
  userName: z.string().nullable().optional(), 
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Assessment data types
export type Role = 'founder' | 'family-employee' | 'family-non-employee' | 'external-advisor';
export type Language = 'en' | 'th';
export type Dimension = 'governance' | 'legacy' | 'relationships' | 'strategy';

export interface Question {
  id: string;
  dimension: Dimension;
  question: { en: string; th: string; };
  options: {
    A: { text: { en: string; th: string; }; points: number; };
    B: { text: { en: string; th: string; }; points: number; };
    C: { text: { en: string; th: string; }; points: number; };
    D: { text: { en: string; th: string; }; points: number; };
  };
}

export interface AssessmentData {
  role: Role;
  language: Language;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  currentQuestionIndex: number;
  isComplete: boolean;
}

export interface DimensionScore {
  score: number;
  maxScore: number;
  percentage: number;
  level: 'critical' | 'needs-improvement' | 'moderate' | 'good' | 'excellent';
}

export interface AssessmentResults {
  governance: DimensionScore;
  legacy: DimensionScore;
  relationships: DimensionScore;
  strategy: DimensionScore;
  overall: DimensionScore;
}
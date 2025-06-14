// server/storage.ts

import { assessmentResponses, adminUsers, type AssessmentResponse, type InsertAssessmentResponse, type AdminUser, type InsertAdminUser } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
// สมมติว่าคุณมีฟังก์ชัน hashPassword ที่นี่ หรือในไฟล์อื่นที่เข้าถึงได้
// import { hashPassword } from './auth'; // ตัวอย่างการ import hashPassword

export interface IStorage {
  // Assessment responses
  createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse>;
  getAssessmentResponses(): Promise<AssessmentResponse[]>;
  getAssessmentResponsesByDateRange(startDate: Date, endDate: Date): Promise<AssessmentResponse[]>;
  deleteAssessmentResponse(id: number): Promise<boolean>;
  clearAllAssessmentResponses(): Promise<boolean>;

  // Admin users
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;

  // Analytics
  getAssessmentStats(): Promise<{
    totalResponses: number;
    monthlyResponses: number;
    averageScore: number;
    completionRate: number;
    roleDistribution: Record<string, number>;
    languageDistribution: Record<string, number>; 
    averageScores: {
      governance: number;
      legacy: number;
      relationships: number;
      strategy: number; 
      overall: number;
    };
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initDefaultAdminUser();
  }

  private async initDefaultAdminUser() {
    try {
      const existingAdmin = await this.getAdminUserByUsername('admin');
      if (!existingAdmin) {
        // ใน Production ควรใช้ library เช่น bcrypt ในการ hash password
        // const hashedPassword = await hashPassword('admin123');
        const hashedPassword = 'admin123'; // WARN: For demonstration only, use proper hashing in production!

        await this.createAdminUser({
          username: 'admin',
          password: hashedPassword
        });
        console.log('Default admin user "admin" created.');
      }
    } catch (error) {
      console.error('Failed to initialize default admin user:', error);
    }
  }

  async createAssessmentResponse(insertResponse: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const [response] = await db
      .insert(assessmentResponses)
      .values({
        ...insertResponse,
        // แก้ไข: ให้ userName บันทึกเป็น null ถ้าเป็น undefined หรือ string ว่าง
        userName: insertResponse.userName && insertResponse.userName.trim() !== '' ? insertResponse.userName.trim() : null,
        ipAddress: insertResponse.ipAddress || null,
        userAgent: insertResponse.userAgent || null,
      })
      .returning();
    return response;
  }

  async getAssessmentResponses(): Promise<AssessmentResponse[]> {
    return await db.select().from(assessmentResponses).orderBy(sql`${assessmentResponses.createdAt} DESC`);
  }

  async getAssessmentResponsesByDateRange(startDate: Date, endDate: Date): Promise<AssessmentResponse[]> {
    return await db
      .select()
      .from(assessmentResponses)
      .where(
        sql`${assessmentResponses.createdAt} >= ${startDate} AND ${assessmentResponses.createdAt} <= ${endDate}`
      );
  }

  async deleteAssessmentResponse(id: number): Promise<boolean> {
    const result = await db.delete(assessmentResponses).where(eq(assessmentResponses.id, id));
    return result.rowCount > 0;
  }

  async clearAllAssessmentResponses(): Promise<boolean> {
    await db.delete(assessmentResponses);
    return true;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db
      .insert(adminUsers)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async getAssessmentStats(): Promise<{
    totalResponses: number;
    monthlyResponses: number;
    averageScore: number;
    completionRate: number;
    roleDistribution: Record<string, number>;
    languageDistribution: Record<string, number>; 
    averageScores: {
      governance: number;
      legacy: number;
      relationships: number;
      strategy: number; 
      overall: number;
    };
  }> {
    const responses = await this.getAssessmentResponses();
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const monthlyResponses = responses.filter(r => r.createdAt && r.createdAt >= currentMonth).length;
    
    const roleDistribution: Record<string, number> = {};
    const languageDistribution: Record<string, number> = {}; 
    
    let totalGovernance = 0;
    let totalLegacy = 0;
    let totalRelationships = 0;
    let totalStrategy = 0; 
    let totalOverall = 0;
    
    responses.forEach(response => {
      roleDistribution[response.role] = (roleDistribution[response.role] || 0) + 1;
      
      totalGovernance += response.governanceScore;
      totalLegacy += response.legacyScore;
      totalRelationships += response.relationshipsScore;
      // แก้ไข: ใช้ response.strategyScore (จาก schema ใหม่) หรือ 0 ถ้าไม่มี (สำหรับข้อมูลเก่า)
      totalStrategy += (response.strategyScore !== undefined && response.strategyScore !== null) ? response.strategyScore : 0; 
      totalOverall += response.overallScore;
    });
    
    const count = responses.length || 1;
    
    const MAX_DIMENSION_SCORE_BACKEND = 12; 
    const MAX_OVERALL_SCORE_BACKEND = 48;   

    return {
      totalResponses: responses.length,
      monthlyResponses,
      averageScore: (totalOverall / count / MAX_OVERALL_SCORE_BACKEND) * 100, 
      completionRate: 100, 
      roleDistribution,
      languageDistribution: {}, 
      averageScores: {
        governance: (totalGovernance / count / MAX_DIMENSION_SCORE_BACKEND) * 100, 
        legacy: (totalLegacy / count / MAX_DIMENSION_SCORE_BACKEND) * 100,      
        relationships: (totalRelationships / count / MAX_DIMENSION_SCORE_BACKEND) * 100, 
        strategy: (totalStrategy / count / MAX_DIMENSION_SCORE_BACKEND) * 100, 
        overall: (totalOverall / count / MAX_OVERALL_SCORE_BACKEND) * 100,       
      },
    };
  }
}

export const storage = new DatabaseStorage();
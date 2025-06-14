import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema"; // ตรวจสอบว่า path นี้ถูกต้องในโปรเจกต์ของคุณ

// ตรวจสอบว่ามี DATABASE_URL ในไฟล์ .env หรือไม่
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please check your .env file.",
  );
}

// สร้าง Connection Pool สำหรับเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// เริ่มต้น Drizzle และส่งออกไปใช้งาน
export const db = drizzle(pool, { schema });
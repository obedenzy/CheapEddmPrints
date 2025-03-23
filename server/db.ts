import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Create database connection with Neon Serverless
const sql = neon(process.env.DATABASE_URL || 'postgres://default:default@localhost:5432/defaultdb');
export const db = drizzle(sql);

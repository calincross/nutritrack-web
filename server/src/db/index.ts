import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import type { MySql2DrizzleConfig } from 'drizzle-orm/mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nutritrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const config: MySql2DrizzleConfig<typeof schema> = {
  schema,
  mode: 'default',
};

export const db = drizzle(pool, config);

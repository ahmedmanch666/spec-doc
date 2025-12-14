import { drizzle } from "drizzle-orm/node-postgres";
import * as pg from "pg";
const { Pool } = pg;
import * as schema from "@shared/schema";

let dbInstance: ReturnType<typeof drizzle> | undefined;
let poolInstance: InstanceType<typeof Pool> | undefined;

export function isDbReady(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

try {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (url) {
    poolInstance = new Pool({
      connectionString: url,
    });
    dbInstance = drizzle(poolInstance, { schema });
  }
} catch (_err) {
  dbInstance = undefined;
}

export const pool = poolInstance;
export const db = dbInstance;

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

let dbInstance: ReturnType<typeof drizzle> | undefined;
let poolInstance: InstanceType<typeof Pool> | undefined;

export function isDbReady(): boolean {
  return !!process.env.DATABASE_URL;
}

try {
  if (process.env.DATABASE_URL) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    dbInstance = drizzle(poolInstance, { schema });
  }
} catch (_err) {
  dbInstance = undefined;
}

export const pool = poolInstance!;
export const db = dbInstance;

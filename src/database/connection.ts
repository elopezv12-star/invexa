import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Conexión serverless a NeonTech PostgreSQL
// La conexión se paga bajo demanda (no bloquea el event loop)
const sql = neon(process.env.DATABASE_URL!);


// Instancia tipada de Drizzle ORM
export const db = drizzle(sql, { schema });

// Helper para verificar salud de la DB
export async function pingDatabase(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1`;
    return result !== null;
  } catch {
    return false;
  }
}

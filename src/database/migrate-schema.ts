/**
 * Migración rápida para agregar columnas discount y has_warranty
 * Ejecutar: npx tsx src/database/migrate-schema.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);

  console.log("📦 Aplicando migración de schema...");

  await sql`ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0`;
  console.log("✅ Columna 'discount' agregada a sale_items");

  await sql`ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS has_warranty BOOLEAN DEFAULT FALSE`;
  console.log("✅ Columna 'has_warranty' agregada a sale_items");

  console.log("🎉 Migración completada.");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});

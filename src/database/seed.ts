/**
 * Seed - Datos de prueba para Invexa POS (Tecnología)
 *
 * Ejecutar: npx tsx src/database/seed.ts
 *
 * Requisito: tener configurada DATABASE_URL en .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  // Importaciones dinámicas después de cargar dotenv
  const { db } = await import("./connection");
  const { products } = await import("./schema");
  const { neon } = await import("@neondatabase/serverless");

  console.log("🌱 Sembrando datos de prueba de tecnología en Invexa...");

  // Limpiar datos existentes (orden inverso por FK)
  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM suggestions`;
  await sql`DELETE FROM sale_items`;
  await sql`DELETE FROM sales`;
  await sql`DELETE FROM products`;

  // Insertar productos de tecnología
  const sampleProducts = [
    { name: "Laptop HP Pavilion 15", price: "5499.00", fragile: true },
    { name: "Monitor LG 24\" IPS", price: "1899.00", fragile: true },
    { name: "Teclado Mecánico Redragon", price: "349.00", fragile: false },
    { name: "Mouse Inalámbrico Logitech", price: "199.00", fragile: false },
    { name: "Audífonos Bluetooth Sony", price: "899.00", fragile: false },
    { name: "Webcam HD 1080p", price: "299.00", fragile: true },
    { name: "Hub USB-C 7 en 1", price: "249.00", fragile: false },
    { name: "SSD Kingston 480GB", price: "499.00", fragile: true },
    { name: "Memoria RAM DDR4 16GB", price: "399.00", fragile: true },
    { name: "Cargador Laptop Universal", price: "279.00", fragile: false },
    { name: "Tablet Samsung Galaxy A9", price: "2199.00", fragile: true },
    { name: "Mousepad XXL Escritorio", price: "149.00", fragile: false },
    { name: "Base Enfriadora Laptop", price: "199.00", fragile: false },
    { name: "Cable HDMI 2m", price: "79.00", fragile: false },
    { name: "Parlante Bluetooth Portátil", price: "349.00", fragile: false },
    { name: "Micrófono USB Podcast", price: "449.00", fragile: true },
    { name: "Lámpara LED Escritorio", price: "189.00", fragile: true },
    { name: "Silla Ergonómica Gamer", price: "2999.00", fragile: false },
    { name: "Impresora Multifuncional Epson", price: "1299.00", fragile: true },
    { name: "Disco Duro Externo 1TB", price: "599.00", fragile: true },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product);
  }

  console.log(`✅ Insertados ${sampleProducts.length} productos`);
  console.log("✅ Seed completado. Listo para usar Invexa POS.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error durante seed:", err);
  process.exit(1);
});

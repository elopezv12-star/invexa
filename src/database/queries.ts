import { db } from "./connection";
import {
  products,
  sales,
  saleItems,
  suggestions,
  type Product,
  type NewSale,
  type NewSaleItem,
  type NewSuggestion,
} from "./schema";
import { eq, gte, sql, count } from "drizzle-orm";

// ============================================================
// PRODUCTOS
// ============================================================

/** Obtener todos los productos del catálogo */
export async function getAllProducts(): Promise<Product[]> {
  return await db.select().from(products).orderBy(products.name);
}

/** Buscar producto por ID */
export async function getProductById(id: number): Promise<Product | undefined> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0];
}

/** Buscar producto por nombre (para el escáner) */
export async function searchProducts(query: string): Promise<Product[]> {
  return await db
    .select()
    .from(products)
    .where(sql`LOWER(${products.name}) LIKE LOWER(${`%${query}%`})`)
    .limit(10);
}

// ============================================================
// VENTAS
// ============================================================

/** Crear una venta completa (transaccional) */
export async function createSale(
  sale: NewSale,
  items: NewSaleItem[],
  sugerecord: NewSuggestion[]
): Promise<number> {
  // Insertar cabecera de venta
  const [newSale] = await db.insert(sales).values(sale).returning({ id: sales.id });

  // Insertar items
  if (items.length > 0) {
    await db.insert(saleItems).values(
      items.map((item) => ({ ...item, saleId: newSale.id }))
    );
  }

  // Insertar sugerencias asociadas
  if (sugerecord.length > 0) {
    await db.insert(suggestions).values(
      sugerecord.map((s) => ({ ...s, saleId: newSale.id }))
    );
  }

  return newSale.id;
}

// ============================================================
// DASHBOARD - Consultas para el Gerente
// ============================================================

/** Obtener el total de ventas del día de hoy */
export async function getTodaySalesTotal(): Promise<number> {
  const today = sql`CURRENT_DATE`;
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${sales.total}), 0)`,
    })
    .from(sales)
    .where(sql`DATE(${sales.createdAt}) = ${today}`);
  return Number(result[0]?.total ?? 0);
}

/** Obtener las ventas por hora para el gráfico del dashboard */
export async function getHourlySales(): Promise<
  { hour: string; total: number }[]
> {
  const today = sql`CURRENT_DATE`;
  const result = await db
    .select({
      hour: sql<string>`TO_CHAR(${sales.createdAt}, 'HH24:00')`,
      total: sql<number>`COALESCE(SUM(${sales.total}), 0)`,
    })
    .from(sales)
    .where(sql`DATE(${sales.createdAt}) = ${today}`)
    .groupBy(sql`TO_CHAR(${sales.createdAt}, 'HH24:00')`)
    .orderBy(sql`TO_CHAR(${sales.createdAt}, 'HH24:00')`);
  return result;
}

/** Obtener estadísticas de sugerencias del día */
export async function getSuggestionStats(): Promise<{
  accepted: number;
  ignored: number;
  total: number;
}> {
  const today = sql`CURRENT_DATE`;
  const result = await db
    .select({
      accepted: sql<number>`COALESCE(SUM(CASE WHEN ${suggestions.accepted} THEN 1 ELSE 0 END), 0)`,
      ignored: sql<number>`COALESCE(SUM(CASE WHEN NOT ${suggestions.accepted} THEN 1 ELSE 0 END), 0)`,
      total: sql<number>`COUNT(*)`,
    })
    .from(suggestions)
    .where(sql`DATE(${suggestions.createdAt}) = ${today}`);
  return {
    accepted: Number(result[0]?.accepted ?? 0),
    ignored: Number(result[0]?.ignored ?? 0),
    total: Number(result[0]?.total ?? 0),
  };
}

/** Obtener lista de productos frágiles */
export async function getFragileProducts(): Promise<Product[]> {
  return await db
    .select()
    .from(products)
    .where(eq(products.fragile, true));
}

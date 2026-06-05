import { NextResponse } from "next/server";
import {
  getTodaySalesTotal,
  getHourlySales,
  getSuggestionStats,
} from "@/database/queries";

/**
 * GET /api/dashboard — Datos agregados para el Dashboard del Gerente
 *
 * Retorna:
 * - todayTotal: ventas totales del día
 * - hourlySales: ventas por hora (para gráfico de barras)
 * - suggestionStats: sugerencias aceptadas vs ignoradas
 */
export async function GET() {
  try {
    const [todayTotal, hourlySales, suggestionStats] = await Promise.all([
      getTodaySalesTotal(),
      getHourlySales(),
      getSuggestionStats(),
    ]);

    return NextResponse.json({
      todayTotal: Number(todayTotal),
      hourlySales: hourlySales.map((h) => ({ ...h, total: Number(h.total) })),
      suggestionStats,

    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error al cargar datos del dashboard" },
      { status: 500 }
    );
  }
}

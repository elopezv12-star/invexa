import { NextRequest, NextResponse } from "next/server";
import { createSale } from "@/database/queries";

/**
 * POST /api/sales — Crear una venta completa
 *
 * Body esperado:
 * {
 *   total: number,
 *   items: { productId: number, quantity: number, unitPrice: number }[],
 *   suggestions: { ruleName: string, message: string, accepted: boolean }[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { total, items = [], suggestions = [] } = body;

    if (!total || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos: total e items son requeridos" },
        { status: 400 }
      );
    }

    const saleId = await createSale(
      { total: total.toString() },
      items.map((i: { productId: number; quantity: number; unitPrice: number; discount?: number; hasWarranty?: boolean }) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice.toString(),
        discount: i.discount ?? 0,
        hasWarranty: i.hasWarranty ?? false,
      })),
      suggestions.map((s: { ruleName: string; message: string; accepted: boolean }) => ({
        ruleName: s.ruleName,
        message: s.message,
        accepted: s.accepted,
      }))
    );


    return NextResponse.json({ saleId, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Error al procesar la venta" },
      { status: 500 }
    );
  }
}

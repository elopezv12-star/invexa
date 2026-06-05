import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, searchProducts } from "@/database/queries";

/**
 * GET /api/products — Lista todos los productos
 * GET /api/products?q=leche — Busca productos por nombre
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const products = query
      ? await searchProducts(query)
      : await getAllProducts();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

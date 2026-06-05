import type { Product } from "@/database/schema";

// ============================================================
// Tipos compartidos del Motor de Reglas
// ============================================================

/** Item en el carrito de compras (en memoria, no en DB aún) */
export interface CartItem {
  product: Product;
  quantity: number;
  /** Descuento porcentual aplicado a este item (ej: 5 = 5%) */
  discount?: number;
}


/** Una sugerencia generada por el motor de reglas */
export interface Suggestion {
  /** Nombre único de la regla que generó la sugerencia */
  ruleName: string;
  /** Mensaje legible para mostrar al cajero */
  message: string;
  /** Acción sugerida (para trazabilidad) */
  action: string;
  /** Nombre del producto sugerido (para agregar al carrito al aceptar) */
  suggestedProductName?: string;
}


/** Contexto que el motor evalúa para producir sugerencias */
export interface RuleContext {
  /** Todos los productos en el carrito actual */
  cart: CartItem[];
  /** El producto que se acaba de escanear (último agregado) */
  lastScannedProduct?: Product;
}

/** Definición de una regla de negocio */
export interface Rule {
  name: string;
  description: string;
  evaluate: (context: RuleContext) => Suggestion | null;
}

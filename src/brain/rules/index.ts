import type { Rule } from "../types";
import { bulkDiscountRule } from "./bulk-discount";
import { fragileHandlingRule } from "./fragile-warranty";
import { complementaryProductsRule } from "./complementary";
import { totalDiscountRule } from "./total-discount";
import { extendedWarrantyRule } from "./extended-warranty";
import { techAccessoriesRule } from "./tech-accessories";

/**
 * Registro maestro de reglas de negocio.
 * Para agregar una nueva regla, solo impórtala y agrégala a este arreglo.
 * El motor las evaluará automáticamente en orden.
 *
 * Reglas activas para Invexa POS (Tecnología):
 * 1. bulk_discount          → Descuento por volumen (≥2 unidades del mismo producto)
 * 2. fragile_handling       → Manejo cuidadoso de productos frágiles de tecnología
 * 3. complementary_products → Sugerir productos complementarios (tecnología)
 * 4. total_discount         → Descuento por total de compra (tech)
 * 5. extended_warranty      → Garantía extendida para productos de alto valor
 * 6. tech_accessories       → Accesorios imprescindibles para dispositivos
 */
export const rulesRegistry: Rule[] = [
  bulkDiscountRule,
  fragileHandlingRule,
  complementaryProductsRule,
  totalDiscountRule,
  extendedWarrantyRule,
  techAccessoriesRule,
];


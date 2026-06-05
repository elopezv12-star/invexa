import type { Rule, Suggestion } from "../types";

/**
 * REGLA 2: Manejo de Productos Frágiles (Tecnología)
 *
 * Si se escanea un producto marcado como "frágil",
 * sugerir al cajero que lo maneje con cuidado, use
 * material de protección y etiquete como frágil.
 * Relevante para tecnología: laptops, monitores, tablets,
 * discos duros, memorias RAM, webcams, micrófonos, etc.
 */
export const fragileHandlingRule: Rule = {
  name: "fragile_handling",
  description: "Producto frágil → sugerir empaque con protección y etiqueta",

  evaluate(context) {
    const product = context.lastScannedProduct;
    if (!product) return null;

    if (product.fragile) {
      const suggestion: Suggestion = {
        ruleName: this.name,
        message: `📦 ¡Producto frágil! "${product.name}" — Usa material de protección (burbuja/espuma), coloca etiqueta de "FRÁGIL" y no lo apiles con productos pesados.`,
        action: `handle_fragile_${product.id}`,
      };
      return suggestion;
    }

    return null;
  },
};


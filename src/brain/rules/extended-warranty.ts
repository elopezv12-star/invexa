import type { Rule, Suggestion } from "../types";

/**
 * REGLA 5: Garantía Extendida para Tecnología
 *
 * Si el carrito contiene productos de alto valor (≥ Q1000),
 * sugerir al cliente agregar una garantía extendida.
 * Productos elegibles: laptops, monitores, tablets,
 * impresoras, sillas ergonómicas, y otros equipos costosos.
 */
export const extendedWarrantyRule: Rule = {
  name: "extended_warranty",
  description:
    "Producto de alto valor (≥ Q1000) → sugerir garantía extendida",

  evaluate(context) {
    // Solo sugerir una vez por carrito, no por cada producto
    const alreadySuggested = context.cart.some((item) => {
      const price = Number(item.product.price);
      return price >= 1000;
    });

    if (!alreadySuggested) return null;

    // Verificar que no hayamos sugerido ya una garantía para este carrito
    // (lo manejamos desde el frontend)

    const highValueItems = context.cart.filter(
      (item) => Number(item.product.price) >= 1000
    );

    if (highValueItems.length === 0) return null;

    const productNames = highValueItems
      .map((item) => item.product.name)
      .join(", ");

    const totalValue = highValueItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const warrantyCost = (totalValue * 0.1).toFixed(2);

    const suggestion: Suggestion = {
      ruleName: this.name,
      message: `🛡️ ¡Protege tu inversión! Los siguientes productos son de alto valor: ${productNames}. Ofrece garantía extendida por solo Q${warrantyCost} (10% del valor total).`,
      action: "suggest_extended_warranty",
    };

    return suggestion;
  },
};

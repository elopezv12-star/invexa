import type { Rule, Suggestion } from "../types";

/**
 * REGLA 1: Descuento por Volumen (Tecnología)
 *
 * Si el carrito tiene 2 o más artículos iguales (tecnología suele
 * comprarse en menor cantidad), sugerir un 5% de descuento en ese producto.
 * Umbral reducido a 2 unidades para adaptarse a compras de tecnología.
 */
export const bulkDiscountRule: Rule = {
  name: "bulk_discount",
  description: "Descuento por volumen: ≥2 unidades del mismo producto → 5% off",


  evaluate(context) {
    for (const item of context.cart) {
      if (item.quantity >= 2) {

        const unitPrice = Number(item.product.price);
        const discount = (unitPrice * item.quantity * 0.05).toFixed(2);
        const totalWithoutDiscount = (unitPrice * item.quantity).toFixed(2);

        const suggestion: Suggestion = {
          ruleName: this.name,
          message: `📦 ¡Descuento por volumen! "${item.product.name}" (x${item.quantity}) — Total sin descuento: Q${totalWithoutDiscount}. Aplica 5% de descuento y ahorra Q${discount}.`,
          action: `apply_5pct_discount_on_${item.product.id}`,
        };
        return suggestion;
      }
    }
    return null;
  },
};

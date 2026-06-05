import type { Rule, Suggestion } from "../types";

/**
 * REGLA 4: Descuento por Total de Compra (Tecnología)
 *
 * Si el total del carrito supera los Q500 (compra de tecnología media),
 * sugerir un 3% de descuento en toda la compra.
 * Si supera los Q1500 (compra de tecnología alta),
 * sugerir un 5% de descuento.
 * Si supera los Q5000 (compra mayorista de tecnología),
 * sugerir un 8% de descuento.
 */
export const totalDiscountRule: Rule = {
  name: "total_discount",
  description: "Total alto → sugerir descuento en compra completa (tech)",

  evaluate(context) {
    const total = context.cart.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    if (total >= 5000) {
      const discount = (total * 0.08).toFixed(2);
      const suggestion: Suggestion = {
        ruleName: this.name,
        message: `🏆 ¡Compra mayorista tecnológica! Total de Q${total.toFixed(2)} — Aplica 8% de descuento en toda la compra. ¡Ahorra Q${discount}!`,
        action: "apply_8pct_discount_on_total",
      };
      return suggestion;
    }

    if (total >= 1500) {
      const discount = (total * 0.05).toFixed(2);
      const suggestion: Suggestion = {
        ruleName: this.name,
        message: `💻 ¡Excelente compra en tecnología! Total de Q${total.toFixed(2)} — Aplica 5% de descuento. ¡Ahorra Q${discount}!`,
        action: "apply_5pct_discount_on_total",
      };
      return suggestion;
    }

    if (total >= 500) {
      const discount = (total * 0.03).toFixed(2);
      const suggestion: Suggestion = {
        ruleName: this.name,
        message: `🎉 ¡Superaste los Q500 en tecnología! Total de Q${total.toFixed(2)} — Aplica 3% de descuento. ¡Ahorra Q${discount}!`,
        action: "apply_3pct_discount_on_total",
      };
      return suggestion;
    }

    return null;
  },
};


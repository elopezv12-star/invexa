import type { RuleContext, Suggestion } from "./types";
import { rulesRegistry } from "./rules";

/**
 * 🧠 INVEXA BRAIN ENGINE
 * Motor de inferencia que evalúa el contexto actual del carrito
 * contra todas las reglas de negocio registradas.
 *
 * Características:
 * - Evaluación síncrona y rápida (no bloquea UI)
 * - Retorna todas las sugerencias activas en este momento
 * - Fácil de extender: solo agrega reglas al registro
 */

export function evaluateCart(context: RuleContext): Suggestion[] {
  const activeSuggestions: Suggestion[] = [];

  for (const rule of rulesRegistry) {
    const result = rule.evaluate(context);
    if (result !== null) {
      activeSuggestions.push(result);
    }
  }

  return activeSuggestions;
}

/**
 * Evalúa si una sugerencia ya existe para evitar duplicados
 */
export function hasActiveSuggestion(
  suggestions: Suggestion[],
  ruleName: string
): boolean {
  return suggestions.some((s) => s.ruleName === ruleName);
}

"use client";

import type { Suggestion } from "@/brain/types";
import { Check, X, Lightbulb, CheckCircle2 } from "lucide-react";

interface SuggestionWithStatus extends Suggestion {
  accepted: boolean;
}

interface SuggestionPanelProps {
  suggestions: SuggestionWithStatus[];
  onAccept: (suggestion: Suggestion) => void;
  onDismiss: (suggestion: Suggestion) => void;
}

export function SuggestionPanel({
  suggestions,
  onAccept,
  onDismiss,
}: SuggestionPanelProps) {
  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
        <div className="rounded-full bg-gray-50 p-4 mb-3">
          <Lightbulb className="h-8 w-8" />
        </div>
        <p className="text-sm font-medium">Sin sugerencias</p>
        <p className="text-xs text-center mt-1">
          El sistema analizará tu compra<br />
          y mostrará recomendaciones aquí
        </p>
      </div>
    );
  }

  const activeCount = suggestions.filter((s) => !s.accepted).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold text-gray-700">
          Sugerencias del Sistema
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {activeCount} pendiente(s)
        </span>
      </div>

      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.ruleName}-${index}`}
          className={`suggestion-enter rounded-xl border p-4 shadow-sm transition-all ${
            suggestion.accepted
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className="text-sm text-gray-800 leading-relaxed">
            {suggestion.message}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {suggestion.accepted ? (
              <div className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Sugerencia aceptada
              </div>
            ) : (
              <>
                <button
                  onClick={() => onAccept(suggestion)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Aceptar
                </button>
                <button
                  onClick={() => onDismiss(suggestion)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Ignorar
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


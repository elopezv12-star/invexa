"use client";

import type { CartItem } from "@/brain/types";
import { Trash2, Plus, Minus, ShieldCheck, BadgePercent } from "lucide-react";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.product.price) * item.quantity * (item.discount || 0)) / 100,
    0
  );

  const total = subtotal - totalDiscount;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-lg font-medium">Carrito vacío</p>
        <p className="text-sm">Escanea productos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {items.map((item) => {
          const itemSubtotal = Number(item.product.price) * item.quantity;
          const itemDiscount =
            (itemSubtotal * (item.discount || 0)) / 100;
          const itemTotal = itemSubtotal - itemDiscount;

          return (
            <div
              key={item.product.id}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Info del producto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-gray-900 truncate">
                    {item.product.name}
                  </span>
                  {item.product.fragile && (
                    <span className="text-xs shrink-0" title="Producto frágil">🥚</span>
                  )}
                  {item.discount && item.discount > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 shrink-0">
                      <BadgePercent className="h-2.5 w-2.5" />
                      -{item.discount}%
                    </span>
                  )}
                  {(item as any).hasWarranty && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 shrink-0">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Garantía
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-brand-600 font-semibold">
                    Q{itemTotal.toFixed(2)}
                  </p>
                  {itemDiscount > 0 && (
                    <p className="text-[11px] text-gray-400 line-through">
                      Q{itemSubtotal.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => onRemoveItem(item.product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 border-t border-gray-100 pt-4 space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>Q{subtotal.toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>Descuentos aplicados</span>
            <span>-Q{totalDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-2xl font-bold text-brand-900">
            Q{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

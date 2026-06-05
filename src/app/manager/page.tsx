"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SalesChart } from "@/components/manager/SalesChart";
import { SuggestionsStats } from "@/components/manager/SuggestionsStats";
import { ArrowLeft, TrendingUp, RefreshCw } from "lucide-react";

interface DashboardData {
  todayTotal: number;
  hourlySales: { hour: string; total: number }[];
  suggestionStats: { accepted: number; ignored: number; total: number };
}

export default function ManagerPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("No se pudieron cargar los datos del dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-brand-900">
                Dashboard del Gerente
              </h1>
              <p className="text-sm text-gray-500">
                Resumen de operaciones del día
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading && !data && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-500">Cargando dashboard...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card: Ventas Totales */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Ventas Totales del Día
                  </p>
                  <p className="text-3xl font-bold text-brand-900 mt-1">
                    Q{data.todayTotal.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-brand-50 p-3">
                  <TrendingUp className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <SalesChart data={data.hourlySales} />
            </div>

            {/* Card: Sugerencias */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Sugerencias del Sistema
                  </p>
                  <p className="text-3xl font-bold text-brand-900 mt-1">
                    {data.suggestionStats.total}
                  </p>
                </div>
                <div className="rounded-full bg-amber-50 p-3">
                  <span className="text-2xl">🧠</span>
                </div>
              </div>
              <SuggestionsStats
                accepted={data.suggestionStats.accepted}
                ignored={data.suggestionStats.ignored}
                total={data.suggestionStats.total}
              />
            </div>

            {/* Resumen rápido */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Resumen del Día
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-brand-50 p-4">
                  <p className="text-2xl font-bold text-brand-700">
                    Q{data.todayTotal.toFixed(2)}
                  </p>
                  <p className="text-xs text-brand-600 mt-1">
                    Ventas totales
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-2xl font-bold text-green-700">
                    {data.suggestionStats.accepted}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Sugerencias aceptadas
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-2xl font-bold text-red-700">
                    {data.suggestionStats.ignored}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Sugerencias ignoradas
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-2xl font-bold text-amber-700">
                    {data.suggestionStats.total > 0
                      ? `${Math.round(
                          (data.suggestionStats.accepted /
                            data.suggestionStats.total) *
                            100
                        )}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Tasa de aceptación
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

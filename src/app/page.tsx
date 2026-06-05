import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Navegación */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              I
            </div>
            <span className="text-xl font-bold text-brand-900">Invexa</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/cashier"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              Ir a Cajero
            </Link>
            <Link
              href="/manager"
              className="rounded-lg border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Dashboard Gerente
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 mb-8">
          🧠 POS Inteligente basado en conocimiento
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-brand-900 sm:text-6xl">
          Invexa
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Sistema de Punto de Venta inteligente con motor de reglas en tiempo real.
          Escanea productos, recibe sugerencias automáticas y toma decisiones más
          inteligentes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-6">
          <Link
            href="/cashier"
            className="rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-700 transition-all"
          >
            🛒 Abrir Cajero
          </Link>
          <Link
            href="/manager"
            className="rounded-xl border-2 border-brand-200 bg-white px-8 py-4 text-base font-semibold text-brand-700 hover:bg-brand-50 transition-all"
          >
            📊 Ver Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-brand-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 text-2xl">
                🟦
              </div>
              <h3 className="text-lg font-semibold text-brand-900">
                La Cara — UI
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Interfaz ultrarrápida para el cajero con panel de sugerencias en vivo.
              </p>
            </div>
            <div className="rounded-xl border border-brand-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 text-2xl">
                🧠
              </div>
              <h3 className="text-lg font-semibold text-brand-900">
                El Cerebro — Reglas
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Motor de inferencia que evalúa compras y sugiere descuentos o garantías.
              </p>
            </div>
            <div className="rounded-xl border border-brand-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 text-2xl">
                📁
              </div>
              <h3 className="text-lg font-semibold text-brand-900">
                El Archivo — Datos
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                PostgreSQL serverless en NeonTech con consultas asíncronas sin bloqueo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

export default function CalculadoraPresupuesto() {
  const [ingresos, setIngresos] = useState("");
  const [gastos, setGastos] = useState([
    { name: "Vivienda", value: "" },
    { name: "Servicios", value: "" },
    { name: "Alimentos", value: "" },
    { name: "Transporte", value: "" },
    { name: "Seguros", value: "" },
    { name: "Salud", value: "" },
    { name: "Otro", value: "" },
  ]);
  const [showResults, setShowResults] = useState(false);

  const totalGastos = gastos.reduce(
    (sum, exp) => sum + (parseFloat(exp.value) || 0),
    0
  );
  const neto = (parseFloat(ingresos) || 0) - totalGastos;

  // --- FIX: add types for TypeScript ---
  function handleGastoChange(i: number, val: string) {
    setGastos((prev) =>
      prev.map((exp, idx) => (idx === i ? { ...exp, value: val } : exp))
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowResults(true);
  }

  function handleReset() {
    setIngresos("");
    setGastos(gastos.map((exp) => ({ ...exp, value: "" })));
    setShowResults(false);
  }

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* Encabezado */}
      <section className="max-w-2xl mx-auto text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-brand-green/10 border shadow-lg w-16 h-16 flex items-center justify-center">
            <FaCalculator className="text-brand-gold text-3xl" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Calculadora de Presupuesto Mensual
        </h1>
        <p className="text-lg text-brand-blue mb-2">
          Una forma sencilla de visualizar tus ingresos, gastos y metas—de manera holística.
        </p>
        <p className="text-brand-body">
          Ingresa tus números mensuales, revisa tu saldo y obtén claridad sobre tu gestión financiera.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-lg mx-auto bg-white rounded-2xl shadow border p-6 mb-8 text-brand-body">
        <h2 className="text-xl font-serif font-bold text-brand-blue mb-2">¿Cómo funciona?</h2>
        <ul className="list-disc ml-6 mb-2 text-base">
          <li>Ingresa tus ingresos mensuales y cada gasto principal.</li>
          <li>Haz clic en <b>Calcular</b> para ver tu saldo y desglose.</li>
          <li>Usa el resultado para ajustar tus hábitos y planificar mejor.</li>
        </ul>
      </section>

      {/* Formulario de la calculadora */}
      <form
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border p-8 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="block text-brand-green font-bold mb-1" htmlFor="ingresos">
            Ingreso mensual (CAD)
          </label>
          <input
            id="ingresos"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={ingresos}
            onChange={(e) => setIngresos(e.target.value)}
            min="0"
            placeholder="ej. 4000"
            required
          />
        </div>
        <h3 className="font-bold text-brand-blue mb-3 text-lg">Gastos</h3>
        {gastos.map((exp, i) => (
          <div className="mb-3" key={exp.name}>
            <label className="block text-brand-body mb-1">{exp.name}</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-brand-green focus:outline-brand-gold text-lg"
              value={exp.value}
              onChange={(e) => handleGastoChange(i, e.target.value)}
              min="0"
              placeholder="0"
              required
            />
          </div>
        ))}
        <div className="flex gap-4 justify-center mt-6">
          <button
            type="submit"
            className="px-7 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
          >
            Calcular
          </button>
          <button
            type="button"
            className="px-7 py-2 bg-brand-blue text-white font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Resultados */}
      {showResults && (
        <section className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-green mb-2">Tus Resultados</h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Ingresos:</span>{" "}
            <span className="font-semibold">{parseFloat(ingresos).toLocaleString("es-CA", {style: "currency", currency: "CAD"})}</span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Gastos:</span>{" "}
            <span className="font-semibold">{totalGastos.toLocaleString("es-CA", {style: "currency", currency: "CAD"})}</span>
          </p>
          <p className={`text-xl font-bold mt-3 ${neto >= 0 ? "text-brand-green" : "text-red-600"}`}>
            {neto >= 0
              ? "Te sobra cada mes:"
              : "Tus gastos superan tus ingresos en:"} <br />
            {neto.toLocaleString("es-CA", {style: "currency", currency: "CAD"})}
          </p>
        </section>
      )}

      {/* Sección educativa / FAQ */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2">
            ¿Por qué presupuestar de manera holística?
          </h3>
          <p className="text-brand-body mb-4">
            Cuando tu presupuesto refleja tus valores y tu vida real—no solo números—es mucho más fácil tomar decisiones financieras con confianza y conciencia. Usa esta calculadora para revisar, ajustar y celebrar tu progreso.
          </p>
        </div>
      </section>
    </main>
  );
}

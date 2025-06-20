"use client";
import { useState, useRef } from "react";
import { FaCalculator, FaPrint, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

export default function CalculadoraPresupuesto() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([
    { name: "Vivienda", value: "" },
    { name: "Servicios", value: "" },
    { name: "Supermercado", value: "" },
    { name: "Transporte", value: "" },
    { name: "Seguro", value: "" },
    { name: "Salud", value: "" },
    { name: "Otros", value: "" },
  ]);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.value) || 0),
    0
  );
  const net = (parseFloat(income) || 0) - totalExpenses;

  function handleExpenseChange(i: number, val: string) {
    setExpenses((prev) =>
      prev.map((exp, idx) => (idx === i ? { ...exp, value: val } : exp))
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowResults(true);
  }

  function handleReset() {
    setIncome("");
    setExpenses(expenses.map((exp) => ({ ...exp, value: "" })));
    setShowResults(false);
  }

  function handlePrint() {
    window.print();
  }

  const today = new Date();
  const printDate = today.toLocaleDateString("es-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* --- FORMULARIO DE PRESUPUESTO --- */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-8 print:hidden"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-brand-green flex items-center gap-2">
          <FaCalculator className="text-brand-gold" /> Calculadora Holística de Presupuesto
        </h1>
        <div className="mb-4">
          <label className="block font-bold text-brand-blue mb-1">
            Ingreso mensual (CAD)
          </label>
          <input
            type="number"
            value={income}
            min={0}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue font-sans text-lg"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-brand-blue mb-2">
            Gastos mensuales
          </label>
          {expenses.map((exp, i) => (
            <div key={exp.name} className="flex items-center mb-2">
              <span className="w-36 font-medium text-brand-green">{exp.name}</span>
              <input
                type="number"
                value={exp.value}
                min={0}
                onChange={(e) => handleExpenseChange(i, e.target.value)}
                className="w-full px-3 py-1 rounded-lg border border-brand-green focus:border-brand-blue font-sans text-base"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
          >
            Calcular
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-brand-blue text-white font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* --- RESULTADOS --- */}
      {showResults && (
        <section
          ref={resultsRef}
          className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center print:bg-white print:border-none print:shadow-none"
        >
          {/* --- SOLO PARA IMPRESIÓN (LOGO, NOMBRE, FECHA) --- */}
          <div className="hidden print:block mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/fanny-logo.png"
                alt="Logo de Fanny Samaniego"
                width={120}
                height={120}
                style={{ margin: "0 auto" }}
                className="mb-2"
              />
              <div className="font-serif font-bold text-brand-green text-2xl mb-1">
                Fanny Samaniego
              </div>
              <div className="text-brand-blue text-lg font-serif">
                Coach Financiera Holística &amp; Asesora
              </div>
              <div className="text-sm mt-2 text-brand-blue">
                Preparado por Fanny Samaniego <br />
                Fecha: {printDate}
              </div>
            </div>
            <hr className="my-3 border-brand-gold" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-brand-green mb-2 print:mt-0">
            Tus Resultados
          </h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Ingreso total:</span>{" "}
            <span className="font-semibold">
              {parseFloat(income).toLocaleString("es-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Gastos totales:</span>{" "}
            <span className="font-semibold">
              {totalExpenses.toLocaleString("es-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>
          </p>
          <p
            className={`text-xl font-bold mt-3 ${
              net >= 0 ? "text-brand-green" : "text-red-600"
            }`}
          >
            {net >= 0
              ? "Te queda dinero disponible cada mes:"
              : "Tus gastos superan tu ingreso por:"}{" "}
            <br />
            {net.toLocaleString("es-CA", {
              style: "currency",
              currency: "CAD",
            })}
          </p>

          {/* Botón de impresión - solo en pantalla */}
          <button
            onClick={handlePrint}
            className="mt-6 px-6 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition flex items-center gap-2 print:hidden"
            type="button"
          >
            <FaPrint className="inline" /> Imprimir resultados (PDF)
          </button>
        </section>
      )}

      {/* --- FAQ Y ORIENTACIÓN --- */}
      <section className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-12 print:hidden">
        <div className="flex items-center mb-4 gap-2">
          <FaQuestionCircle className="text-brand-blue text-2xl" />
          <h3 className="font-serif font-bold text-brand-green text-2xl">
            Preguntas frecuentes y orientación
          </h3>
        </div>
        <ul className="list-disc pl-6 text-brand-body space-y-3 text-base">
          <li>
            <b>¿Qué cuenta como “ingreso”?</b> <br />
            Incluye tu salario neto después de impuestos, más cualquier ingreso regular de rentas, trabajo independiente, gobierno o actividades extra.
          </li>
          <li>
            <b>¿Cómo clasifico mis gastos?</b> <br />
            Usa las categorías proporcionadas, pero puedes añadir más en “Otros” (por ejemplo: hijos, mascotas, ahorro, donaciones).
          </li>
          <li>
            <b>¿Con qué frecuencia debo hacer un presupuesto?</b> <br />
            Al menos una vez al mes—o cada vez que cambie tu situación. ¡Revisarlo regularmente te da claridad y confianza!
          </li>
          <li>
            <b>¿Se guarda mi información?</b> <br />
            No—todo queda en tu dispositivo, nada se almacena ni se comparte. Esta calculadora es 100% privada y segura.
          </li>
          <li>
            <b>¿Qué hago si mis gastos son más altos que mis ingresos?</b> <br />
            No te preocupes. Esto es solo un punto de partida para tomar conciencia y hacer cambios positivos. Considera ajustar gastos no esenciales o contáctame para apoyo.
          </li>
        </ul>
        <div className="mt-6 text-center">
          <span className="font-sans text-brand-green text-base">
            ¿Quieres asesoría personalizada?{" "}
            <a
              href="/es/contacto"
              className="text-brand-blue font-bold underline hover:text-brand-gold"
            >
              Contacta a Fanny
            </a>
          </span>
        </div>
      </section>
    </main>
  );
}

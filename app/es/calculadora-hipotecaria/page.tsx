"use client";
import { useState } from "react";
import Link from "next/link";
import { FaHome, FaLightbulb, FaClipboardList, FaPrint } from "react-icons/fa";
import Image from "next/image";

// Calculadora de hipoteca
function calcMortgage(principal: number, rate: number, years: number): number {
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n || 0;
  const payment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return payment || 0;
}

export default function CalculadoraHipotecaria() {
  const [precio, setPrecio] = useState("");
  const [enganche, setEnganche] = useState("");
  const [tasa, setTasa] = useState("");
  const [anios, setAnios] = useState(25);
  const [multi, setMulti] = useState(false);
  const [unidades, setUnidades] = useState(4);
  const [renta, setRenta] = useState("");
  const [showResults, setShowResults] = useState(false);

  const prestamo = Math.max(0, (parseFloat(precio) || 0) - (parseFloat(enganche) || 0));
  const mensual = calcMortgage(prestamo, parseFloat(tasa) || 0, anios);
  const totalPagado = mensual * anios * 12;
  const totalInteres = totalPagado - prestamo;
  const porUnidad = multi && unidades > 0 ? mensual / unidades : mensual;
  const rentaMensual = parseFloat(renta) || 0;
  const totalRenta = multi && unidades > 0 ? rentaMensual * unidades : 0;
  const flujo = multi ? totalRenta - mensual : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowResults(true);
  }

  function handleReset() {
    setPrecio("");
    setEnganche("");
    setTasa("");
    setAnios(25);
    setMulti(false);
    setUnidades(4);
    setRenta("");
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
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Encabezado */}
      <section className="max-w-2xl mx-auto text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-brand-blue/10 border shadow-lg w-16 h-16 flex items-center justify-center">
            <FaHome className="text-brand-blue text-3xl" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-blue font-bold mb-3">
          Calculadora Hipotecaria
        </h1>
        <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>
        <p className="text-lg text-brand-green mb-2">
          Calcula al instante tus pagos mensuales—¡incluso para propiedades de múltiples unidades!
        </p>
        <p className="text-brand-body">
          Ajusta los valores y descubre el pago, intereses y más para cualquier escenario: casa individual o “missing middle”.
        </p>
      </section>

      {/* ¿Cómo funciona? */}
      <section className="max-w-lg mx-auto bg-white/90 rounded-2xl shadow border border-brand-gold p-6 mb-8 text-brand-body">
        <h2 className="text-xl font-serif font-bold text-brand-blue mb-2">¿Cómo funciona?</h2>
        <ul className="list-disc ml-6 mb-2 text-base">
          <li>Ingresa el precio de la propiedad, enganche, tasa de interés y plazo de amortización.</li>
          <li>
            <span className="font-bold">¿Quieres analizar una propiedad de varias unidades?</span> Activa “Propiedad Multi-Unidad” e ingresa el número de unidades y la renta mensual estimada por unidad.
          </li>
          <li>Haz clic en <b>Calcular</b> para ver tu pago y todos los detalles.</li>
        </ul>
      </section>

      {/* Formulario */}
      <form
        className="max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl border border-brand-gold p-8 mb-10 print:hidden"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="precio">
            Precio de la propiedad (CAD)
          </label>
          <input
            id="precio"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
            placeholder="ej. 800000"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="enganche">
            Enganche (CAD)
          </label>
          <input
            id="enganche"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={enganche}
            onChange={(e) => setEnganche(e.target.value)}
            min="0"
            placeholder="ej. 160000"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="tasa">
            Tasa de interés (anual %)
          </label>
          <input
            id="tasa"
            type="number"
            step="0.01"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={tasa}
            onChange={(e) => setTasa(e.target.value)}
            min="0"
            max="20"
            placeholder="ej. 5.2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="anios">
            Plazo de amortización (años)
          </label>
          <input
            id="anios"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={anios}
            onChange={(e) => setAnios(Number(e.target.value))}
            min="5"
            max="35"
            placeholder="ej. 25"
            required
          />
        </div>

        {/* Toggle multi-unidad */}
        <div className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            id="multi"
            checked={multi}
            onChange={() => setMulti((v) => !v)}
            className="accent-brand-blue w-5 h-5"
          />
          <label htmlFor="multi" className="font-bold text-brand-blue">
            Propiedad Multi-Unidad
          </label>
        </div>

        {multi && (
          <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-4 rounded-xl mb-6">
            <div className="mb-4">
              <label className="block text-brand-blue font-bold mb-1" htmlFor="unidades">
                Número de unidades
              </label>
              <input
                id="unidades"
                type="number"
                min="2"
                max="12"
                className="w-full px-4 py-2 rounded-lg border border-brand-blue text-lg"
                value={unidades}
                onChange={(e) => setUnidades(Number(e.target.value))}
                placeholder="ej. 4"
                required
              />
            </div>
            <div>
              <label className="block text-brand-blue font-bold mb-1" htmlFor="renta">
                Renta mensual esperada por unidad (CAD)
              </label>
              <input
                id="renta"
                type="number"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-brand-blue text-lg"
                value={renta}
                onChange={(e) => setRenta(e.target.value)}
                placeholder="ej. 2200"
              />
            </div>
          </div>
        )}

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
        <section className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center print:bg-white print:border-none print:shadow-none">
          {/* Print logo/date */}
          <div className="hidden print:block mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/fanny-logo.png"
                alt="Fanny Samaniego Logo"
                width={120}
                height={120}
                style={{ margin: "0 auto" }}
                className="mb-2"
              />
              <div className="font-serif font-bold text-brand-green text-2xl mb-1">
                Fanny Samaniego
              </div>
              <div className="text-brand-blue text-lg font-serif">
                Coach Financiera Holística
              </div>
              <div className="text-sm mt-2 text-brand-blue">
                Preparado por Fanny Samaniego <br />
                Fecha: {printDate}
              </div>
            </div>
            <hr className="my-3 border-brand-gold" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2 print:mt-0">
            Tus Resultados
          </h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Monto del préstamo:</span>{" "}
            <span className="font-semibold">
              {prestamo.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Pago mensual estimado:</span>{" "}
            <span className="font-semibold">
              {mensual.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          {multi && (
            <>
              <p className="text-lg mb-2">
                <span className="font-bold text-brand-blue">Pago por unidad:</span>{" "}
                <span className="font-semibold">
                  {porUnidad.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-bold text-brand-blue">Ingreso total por renta (todas las unidades):</span>{" "}
                <span className="font-semibold">
                  {totalRenta.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
                </span>
              </p>
              {typeof flujo === "number" && (
                <p className={`text-lg font-bold mt-3 ${flujo >= 0 ? "text-brand-green" : "text-red-600"}`}>
                  {flujo >= 0
                    ? "Flujo de caja estimado positivo: "
                    : "Déficit estimado: "}
                  {flujo.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
                </p>
              )}
            </>
          )}
          <p className="text-lg mb-2 mt-4">
            <span className="font-bold text-brand-blue">Total pagado en {anios} años:</span>{" "}
            <span className="font-semibold">
              {totalPagado.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-bold text-brand-blue">Intereses totales:</span>{" "}
            <span className="font-semibold">
              {totalInteres.toLocaleString("es-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          <button
            onClick={handlePrint}
            className="mt-6 px-6 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition flex items-center gap-2 print:hidden"
            type="button"
          >
            <FaPrint className="inline" /> Imprimir Resultados (PDF)
          </button>
        </section>
      )}

      {/* Consideraciones clave */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="rounded-2xl border-l-4 border-brand-blue bg-white/90 p-6 shadow flex items-center gap-4 border border-brand-gold">
          <FaClipboardList className="text-brand-blue text-3xl" />
          <div>
            <h3 className="text-lg font-bold text-brand-blue mb-1">
              Consideraciones clave para compradores de multi-unidades
            </h3>
            <ul className="text-brand-body list-disc ml-6 text-base">
              <li>La mayoría de los bancos en Canadá exige al menos 20% de enganche para 4+ unidades.</li>
              <li>Consideran el ingreso por renta (pero no siempre el 100%).</li>
              <li>Planea para vacantes, reparaciones e impuestos a la propiedad.</li>
              <li>Tu ingreso personal y tu crédito siguen siendo importantes.</li>
              <li>La administración profesional puede darte mucha tranquilidad.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Consejos para inversionistas */}
      <section className="max-w-3xl mx-auto mb-10">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow">
          <div className="flex items-center mb-3">
            <FaLightbulb className="text-brand-gold text-2xl mr-2" />
            <h3 className="text-xl font-serif font-bold text-brand-green">
              Consejos para inversionistas en multi-unidades
            </h3>
          </div>
          <ul className="text-brand-body list-disc ml-6 text-base">
            <li><span className="font-bold">Usa siempre estimaciones conservadoras de renta</span>—deja margen para vacantes y mantenimiento.</li>
            <li><span className="font-bold">Haz una prueba de estrés</span>: ¿y si sube la tasa de interés? ¿Sigue siendo positivo tu flujo de caja?</li>
            <li><span className="font-bold">Considera todos los gastos</span>, no solo la hipoteca: servicios, seguros, administración, reparaciones.</li>
            <li>Consulta con un profesional hipotecario con experiencia en multi-unidades y “missing middle” antes de comprometerte.</li>
            <li><span className="font-bold">Conéctate con otros propietarios/inversionistas</span>: foros como LandlordBC o grupos de Facebook pueden aportar experiencia real.</li>
          </ul>
        </div>
      </section>

      {/* Siguientes pasos / CTA */}
      <section className="max-w-3xl mx-auto mb-12 text-center">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-white/90 p-8 shadow border border-brand-gold">
          <h3 className="text-xl font-serif font-bold text-brand-blue mb-2">
            ¿Listo para dar el siguiente paso?
          </h3>
          <p className="text-brand-body mb-4">
            Agenda una llamada gratuita para estrategias personalizadas o solicita gratis nuestro Checklist Hipotecario Multi-Unidad.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/es/contacto">
              <button className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
                Agendar llamada
              </button>
            </Link>
            <a
              href="mailto:info@fannysamaniego.com?subject=Checklist%20Hipotecario%20Multi-Unidad"
              className="px-8 py-3 bg-brand-blue text-white font-serif font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition-all text-lg"
            >
              Solicitar Checklist Gratis
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
